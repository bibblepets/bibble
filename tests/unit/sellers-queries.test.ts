import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

const session = vi.hoisted(() => ({ user: null as { id: string } | null }))
const requireUser = vi.hoisted(() => vi.fn())
vi.mock("@/lib/auth/session", () => ({ getCurrentUser: async () => session.user, requireUser }))

const redirect = vi.hoisted(() =>
	vi.fn((path: string) => {
		throw new Error(`NEXT_REDIRECT ${path}`)
	})
)
vi.mock("next/navigation", () => ({ redirect }))

/** A chainable stand-in for the query builder that resolves to `result`. */
const result = vi.hoisted(() => ({ current: { data: null as unknown, error: null as { message: string } | null } }))
const calls = vi.hoisted(() => [] as unknown[][])
vi.mock("@/lib/supabase/server", () => {
	const builder: Record<string, unknown> = {}
	for (const method of ["from", "select", "eq", "order"]) {
		builder[method] = (...args: unknown[]) => {
			calls.push([method, ...args])
			return builder
		}
	}
	builder.maybeSingle = async () => result.current
	builder.then = (resolve: (value: unknown) => void) => resolve(result.current)
	// Wrapped so awaiting createClient() doesn't resolve the thenable builder itself.
	return { createClient: async () => ({ from: builder.from }) }
})

const { getCurrentSeller, listAreas, listSpecies, requireSeller } = await import("@/lib/sellers/queries")

const row = {
	role: "owner",
	seller: {
		id: "seller-1",
		slug: "pawsome-kennels-abc123",
		seller_type: "breeder",
		display_name: "Pawsome Kennels",
		legal_name: "Pawsome Kennels Pte. Ltd.",
		uen: "202301234K",
		licence_no: "BR25001",
		licence_expires_on: "2027-10-01",
		about: null,
		area_id: 30,
		verification_status: "pending",
		submitted_at: "2026-10-02T00:00:00Z",
		verified_at: null,
		area: { name: "Lim Chu Kang", region: "north" },
		private: {
			address_line1: "59 Sungei Tengah Road",
			address_line2: null,
			postal_code: "699012",
			contact_phone: "+6591234567",
			contact_email: "alice@bibble.test",
		},
		seller_species: [{ species: { slug: "dog", name: "Dogs" } }, { species: null }],
		seller_documents: [
			{ id: "doc-old", kind: "avs_licence", file_name: "old.pdf", size_bytes: 10, created_at: "2026-10-01T00:00:00Z" },
			{ id: "doc-new", kind: "avs_licence", file_name: "new.pdf", size_bytes: 20, created_at: "2026-10-02T00:00:00Z" },
			{
				id: "doc-acra",
				kind: "acra_bizfile",
				file_name: "acra.pdf",
				size_bytes: 30,
				created_at: "2026-10-01T00:00:00Z",
			},
		],
	},
}

beforeEach(() => {
	session.user = { id: "user-1" }
	result.current = { data: row, error: null }
	calls.length = 0
	redirect.mockClear()
})

describe("getCurrentSeller", () => {
	it("returns null when signed out", async () => {
		session.user = null
		expect(await getCurrentSeller()).toBeNull()
		expect(calls).toEqual([])
	})

	it("returns null when the user has no seller", async () => {
		result.current = { data: null, error: null }
		expect(await getCurrentSeller()).toBeNull()
		expect(calls).toContainEqual(["eq", "user_id", "user-1"])
	})

	it("maps the seller, keeping the newest document of each kind", async () => {
		const seller = await getCurrentSeller()

		expect(seller).toMatchObject({
			id: "seller-1",
			role: "owner",
			status: "pending",
			sellerType: "breeder",
			displayName: "Pawsome Kennels",
			area: { name: "Lim Chu Kang", region: "north" },
			addressLine1: "59 Sungei Tengah Road",
			contactPhone: "+6591234567",
			species: [{ slug: "dog", name: "Dogs" }],
			speciesCount: 1,
		})
		expect(seller?.documents.avs_licence?.id).toBe("doc-new")
		expect(seller?.documents.acra_bizfile?.fileName).toBe("acra.pdf")
		expect(seller?.documentKinds.toSorted()).toEqual(["acra_bizfile", "avs_licence"])
	})

	it("tolerates missing private details", async () => {
		result.current = { data: { ...row, seller: { ...row.seller, private: null, seller_documents: [] } }, error: null }
		expect(await getCurrentSeller()).toMatchObject({ addressLine1: null, contactEmail: null, documentKinds: [] })
	})

	it("throws on query errors", async () => {
		result.current = { data: null, error: { message: "boom" } }
		await expect(getCurrentSeller()).rejects.toThrow("Failed to load seller: boom")
	})
})

describe("requireSeller", () => {
	it("returns the seller", async () => {
		await expect(requireSeller("/seller")).resolves.toMatchObject({ id: "seller-1" })
		expect(requireUser).toHaveBeenCalledWith("/seller")
	})

	it("sends users without a seller to onboarding", async () => {
		result.current = { data: null, error: null }
		await expect(requireSeller("/seller")).rejects.toThrow("NEXT_REDIRECT /seller/onboarding")
	})
})

describe("reference data", () => {
	it("lists areas by name", async () => {
		result.current = { data: [{ id: 1, name: "Bedok", region: "east" }], error: null }
		expect(await listAreas()).toEqual([{ id: 1, name: "Bedok", region: "east" }])
		expect(calls).toContainEqual(["order", "name"])
	})

	it("lists species with camelCase fields", async () => {
		result.current = { data: [{ id: 1, slug: "dog", name: "Dogs", is_active: true }], error: null }
		expect(await listSpecies()).toEqual([{ id: 1, slug: "dog", name: "Dogs", isActive: true }])
	})

	it.each([
		["areas", () => listAreas()],
		["species", () => listSpecies()],
	])("throws when %s fail to load", async (label, load) => {
		result.current = { data: null, error: { message: "down" } }
		await expect(load()).rejects.toThrow(`Failed to load ${label}: down`)
	})
})
