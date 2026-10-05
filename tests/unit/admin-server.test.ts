import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeSeller } from "./fixtures/seller"

vi.mock("server-only", () => ({}))

// --- Fake Supabase client: queries resolve to results keyed by table or rpc name -------------------------------------
type Result = { data: unknown; error: { code?: string; message: string } | null }
const db = vi.hoisted(() => ({
	results: {} as Record<string, Result>,
	calls: [] as unknown[][],
	signedUrl: { data: { signedUrl: "https://storage.test/signed" }, error: null } as Result,
}))

function builder(key: string) {
	const chain: Record<string, unknown> = {}
	for (const method of ["select", "eq", "order", "limit"]) {
		chain[method] = (...args: unknown[]) => {
			db.calls.push([key, method, ...args])
			return chain
		}
	}
	const result = () => db.results[key] ?? { data: null, error: null }
	chain.maybeSingle = async () => result()
	chain.then = (resolve: (value: Result) => void) => resolve(result())
	return chain
}

vi.mock("@/lib/supabase/server", () => ({
	createClient: async () => ({
		from: (table: string) => builder(table),
		rpc: (name: string, args?: unknown) => {
			db.calls.push(["rpc", name, args])
			return builder(name)
		},
		storage: {
			from: () => ({
				async createSignedUrl(path: string, seconds: number) {
					db.calls.push(["storage", "createSignedUrl", path, seconds])
					return db.signedUrl
				},
			}),
		},
	}),
}))

const session = vi.hoisted(() => ({ user: { id: "admin-1" } as { id: string } | null }))
vi.mock("@/lib/auth/session", () => ({
	getCurrentUser: async () => session.user,
	requireUser: async () => {
		if (!session.user) throw new Error("NEXT_REDIRECT /login")
		return session.user
	},
}))

const sellerById = vi.hoisted(() => ({ current: null as unknown }))
vi.mock("@/lib/sellers/queries", () => ({ getSellerById: async () => sellerById.current }))

class Redirect extends Error {}
vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Redirect(path)
	},
	notFound: () => {
		throw new Error("NEXT_NOT_FOUND")
	},
}))
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))

const { isPlatformAdmin, requireAdmin } = await import("@/lib/admin/session")
const queries = await import("@/lib/admin/queries")
const actions = await import("@/lib/admin/actions")
const { checklistKeys } = await import("@/lib/admin/checklist")

beforeEach(() => {
	session.user = { id: "admin-1" }
	db.results = { is_platform_admin: { data: true, error: null } }
	db.calls = []
	db.signedUrl = { data: { signedUrl: "https://storage.test/signed" }, error: null }
	sellerById.current = null
})

describe("admin session", () => {
	it("is false for signed-out users without asking the database", async () => {
		session.user = null
		expect(await isPlatformAdmin()).toBe(false)
		expect(db.calls).toEqual([])
	})

	it("asks the database for signed-in users", async () => {
		expect(await isPlatformAdmin()).toBe(true)
		db.results.is_platform_admin = { data: false, error: null }
		expect(await isPlatformAdmin()).toBe(false)
	})

	it("throws if the check fails", async () => {
		db.results.is_platform_admin = { data: null, error: { message: "down" } }
		await expect(isPlatformAdmin()).rejects.toThrow("Failed to check admin access: down")
	})

	it("returns the admin and 404s everyone else", async () => {
		await expect(requireAdmin("/admin")).resolves.toEqual({ id: "admin-1" })
		db.results.is_platform_admin = { data: false, error: null }
		await expect(requireAdmin("/admin")).rejects.toThrow("NEXT_NOT_FOUND")
		session.user = null
		await expect(requireAdmin("/admin")).rejects.toThrow("NEXT_REDIRECT /login")
	})
})

describe("admin queries", () => {
	it("counts sellers by status, filling in zeros", async () => {
		db.results.admin_seller_status_counts = {
			data: [
				{ status: "pending", total: 3 },
				{ status: "verified", total: "12" },
			],
			error: null,
		}
		expect(await queries.countSellersByStatus()).toEqual({
			incomplete: 0,
			pending: 3,
			verified: 12,
			rejected: 0,
			suspended: 0,
		})
	})

	it("lists the pending queue oldest first and other statuses newest first", async () => {
		db.results.sellers = {
			data: [
				{
					id: "s1",
					display_name: "Furry Friends",
					seller_type: "pet_shop",
					uen: "202455555E",
					licence_no: "AS25C01234",
					submitted_at: "2026-10-01T00:00:00Z",
					updated_at: "2026-10-01T00:00:00Z",
					area: { name: "Bedok", region: "east" },
				},
			],
			error: null,
		}
		expect(await queries.listSellersForReview("pending")).toEqual([
			{
				id: "s1",
				displayName: "Furry Friends",
				sellerType: "pet_shop",
				uen: "202455555E",
				licenceNo: "AS25C01234",
				area: { name: "Bedok", region: "east" },
				submittedAt: "2026-10-01T00:00:00Z",
				updatedAt: "2026-10-01T00:00:00Z",
			},
		])
		expect(db.calls).toContainEqual(["sellers", "order", "submitted_at", { ascending: true }])

		await queries.listSellersForReview("verified")
		expect(db.calls).toContainEqual(["sellers", "order", "updated_at", { ascending: false }])
	})

	it.each([
		["counts", () => queries.countSellersByStatus(), "admin_seller_status_counts", "Failed to count sellers"],
		["lists", () => queries.listSellersForReview("pending"), "sellers", "Failed to load sellers"],
	])("throws when %s fail", async (_label, load, key, message) => {
		db.results[key] = { data: null, error: { message: "down" } }
		await expect(load()).rejects.toThrow(`${message}: down`)
	})

	it("loads a seller with owner and history", async () => {
		sellerById.current = makeSeller({ id: "s1" })
		db.results.admin_seller_owner = { data: { email: "eve@bibble.test", display_name: "Eve" }, error: null }
		db.results.seller_reviews = {
			data: [
				{
					id: "r1",
					decision: "rejected",
					message: "Fix it",
					internal_note: "note",
					checklist: [],
					created_at: "2026-10-02T00:00:00Z",
					reviewer: { display_name: "Carol" },
				},
				{
					id: "r0",
					decision: "approved",
					message: null,
					internal_note: null,
					checklist: ["a"],
					created_at: "2026-10-01T00:00:00Z",
					reviewer: null,
				},
			],
			error: null,
		}

		const review = await queries.getSellerForReview("s1")

		expect(review?.owner).toEqual({ email: "eve@bibble.test", displayName: "Eve" })
		expect(review?.history.map((entry) => [entry.decision, entry.reviewerName, entry.internalNote])).toEqual([
			["rejected", "Carol", "note"],
			["approved", null, null],
		])
	})

	it("returns null for unknown sellers and tolerates a missing owner", async () => {
		expect(await queries.getSellerForReview("missing")).toBeNull()

		sellerById.current = makeSeller({ id: "s2" })
		db.results.seller_reviews = { data: [], error: null }
		expect(await queries.getSellerForReview("s2")).toMatchObject({ owner: null, history: [] })
	})

	it("throws when the history fails to load", async () => {
		sellerById.current = makeSeller({ id: "s3" })
		db.results.seller_reviews = { data: null, error: { message: "down" } }
		await expect(queries.getSellerForReview("s3")).rejects.toThrow("Failed to load seller review: down")
	})

	it("signs document URLs for 60 seconds", async () => {
		db.results.seller_documents = { data: { storage_path: "s1/file.pdf" }, error: null }
		expect(await queries.signedDocumentUrl("d1")).toBe("https://storage.test/signed")
		expect(db.calls).toContainEqual(["storage", "createSignedUrl", "s1/file.pdf", 60])
	})

	it("returns null for unknown documents or missing files", async () => {
		expect(await queries.signedDocumentUrl("missing")).toBeNull()

		db.results.seller_documents = { data: { storage_path: "s1/gone.pdf" }, error: null }
		db.signedUrl = { data: null, error: { message: "Object not found" } }
		expect(await queries.signedDocumentUrl("d2")).toBeNull()
	})
})

describe("admin actions", () => {
	function form(fields: Record<string, string | string[]>) {
		const formData = new FormData()
		for (const [key, value] of Object.entries(fields)) {
			for (const v of Array.isArray(value) ? value : [value]) formData.append(key, v)
		}
		return formData
	}

	async function run<T>(action: () => Promise<T>) {
		try {
			return await action()
		} catch (error) {
			if (error instanceof Redirect) return { redirectedTo: error.message }
			throw error
		}
	}

	it("approves through review_seller and returns to the seller", async () => {
		const result = await run(() =>
			actions.reviewSeller("s1", {}, form({ decision: "approved", message: "", checklist: [...checklistKeys] }))
		)
		expect(result).toEqual({ redirectedTo: "/admin/sellers/s1" })
		expect(db.calls).toContainEqual([
			"rpc",
			"review_seller",
			{
				p_seller_id: "s1",
				p_decision: "approved",
				p_message: undefined,
				p_internal_note: undefined,
				p_checklist: [...checklistKeys],
			},
		])
	})

	it("passes messages and notes when rejecting", async () => {
		await run(() =>
			actions.reviewSeller("s1", {}, form({ decision: "rejected", message: " Fix it ", internalNote: "Called them" }))
		)
		expect(db.calls).toContainEqual([
			"rpc",
			"review_seller",
			expect.objectContaining({ p_decision: "rejected", p_message: "Fix it", p_internal_note: "Called them" }),
		])
	})

	it("validates before calling the database", async () => {
		expect(await actions.reviewSeller("s1", {}, form({ decision: "rejected", message: "" }))).toMatchObject({
			fieldErrors: { message: expect.stringMatching(/Tell the seller why/) },
		})
		expect(db.calls.some(([, name]) => name === "review_seller")).toBe(false)
	})

	it("reports database refusals", async () => {
		db.results.review_seller = { data: null, error: { message: "invalid_transition" } }
		expect(await actions.reviewSeller("s1", {}, form({ decision: "reinstated" }))).toMatchObject({
			formError: expect.stringMatching(/status has changed/),
		})
	})

	it("refuses non-admins", async () => {
		db.results.is_platform_admin = { data: false, error: null }
		await expect(actions.reviewSeller("s1", {}, form({ decision: "reinstated" }))).rejects.toThrow("NEXT_NOT_FOUND")
	})

	const correction = {
		sellerType: "pet_shop",
		legalName: "Happy Paws Trading",
		uen: "53123456A",
		licenceNo: "AS24A01000",
		species: ["dog"],
		internalNote: "Renewed licence",
	}

	it("corrects details through admin_correct_seller", async () => {
		expect(await run(() => actions.correctSellerDetails("s1", {}, form(correction)))).toEqual({
			redirectedTo: "/admin/sellers/s1",
		})
		expect(db.calls).toContainEqual([
			"rpc",
			"admin_correct_seller",
			{
				p_seller_id: "s1",
				p_seller_type: "pet_shop",
				p_legal_name: "Happy Paws Trading",
				p_uen: "53123456A",
				p_licence_no: "AS24A01000",
				p_species: ["dog"],
				p_internal_note: "Renewed licence",
			},
		])
	})

	it("returns correction field errors", async () => {
		expect(await actions.correctSellerDetails("s1", {}, form({ ...correction, internalNote: "" }))).toMatchObject({
			fieldErrors: { internalNote: "Explain the correction for the audit trail." },
		})
	})

	it.each([
		[{ code: "23505", message: "duplicate key" }, "Another seller already uses this UEN."],
		[{ message: "invalid_species" }, "Choose at least one species we support."],
	])("reports correction error %j", async (error, message) => {
		db.results.admin_correct_seller = { data: null, error }
		expect((await actions.correctSellerDetails("s1", {}, form(correction))).formError).toBe(message)
	})
})
