import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

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
	return { createClient: async () => ({ from: builder.from }) }
})

const { getListingForEdit, listBreeds, listSellerListings } = await import("@/lib/listings/queries")

const editRow = {
	id: "l1",
	seller_id: "s1",
	status: "draft",
	title: "Golden Retriever puppy",
	description: null,
	price_cents: 360000,
	submitted_at: null,
	published_at: null,
	updated_at: "2026-10-05T00:00:00Z",
	category: { slug: "dogs", name: "Dogs" },
	details: [
		{
			sex: "female",
			date_of_birth: "2026-07-27",
			ready_date: "2026-10-05",
			colour: "Golden",
			weight_kg: 6.5,
			height_cm: null,
			sterilised: false,
			breed: { id: 50, name: "Golden Retriever", specified_part: null },
			cross: null,
		},
	],
	private: {
		microchip_no: "900085000000004",
		source: "licensed_breeder",
		source_licence_no: "BR25001",
		import_permit_no: null,
		arrival_date: null,
	},
	pet_health_records: [
		{ id: "h2", kind: "vaccination", given_on: "2026-09-21", product: "DHPPi", clinic: null },
		{ id: "h1", kind: "deworming", given_on: "2026-08-10", product: "Drontal", clinic: "Vet" },
	],
	listing_documents: [
		{ id: "d1", kind: "vaccination_card", file_name: "old.pdf", size_bytes: 10, created_at: "2026-10-01" },
		{ id: "d2", kind: "vaccination_card", file_name: "new.pdf", size_bytes: 20, created_at: "2026-10-02" },
	],
}

beforeEach(() => {
	calls.length = 0
	result.current = { data: null, error: null }
})

describe("listBreeds", () => {
	it("lists a species' breeds alphabetically", async () => {
		result.current = { data: [{ id: 4, name: "Akita", specified_part: 1, species: { slug: "dog" } }], error: null }
		expect(await listBreeds()).toEqual([{ id: 4, name: "Akita", specifiedPart: 1 }])
		expect(calls).toContainEqual(["eq", "species.slug", "dog"])
		expect(calls).toContainEqual(["order", "name"])
	})
})

describe("listSellerListings", () => {
	it("maps rows with breed names", async () => {
		result.current = {
			data: [
				{
					id: "l1",
					title: "Cavapoo",
					status: "published",
					price_cents: 450000,
					updated_at: "2026-10-05",
					details: [{ date_of_birth: "2026-07-29", breed: { name: "Cavalier" }, cross: { name: "Poodle (Toy)" } }],
				},
				{ id: "l2", title: null, status: "draft", price_cents: null, updated_at: "2026-10-04", details: [] },
			],
			error: null,
		}
		expect(await listSellerListings("s1")).toEqual([
			{
				id: "l1",
				title: "Cavapoo",
				status: "published",
				priceCents: 450000,
				breedName: "Cavalier",
				crossBreedName: "Poodle (Toy)",
				dateOfBirth: "2026-07-29",
				updatedAt: "2026-10-05",
			},
			{
				id: "l2",
				title: null,
				status: "draft",
				priceCents: null,
				breedName: null,
				crossBreedName: null,
				dateOfBirth: null,
				updatedAt: "2026-10-04",
			},
		])
		expect(calls).toContainEqual(["eq", "seller_id", "s1"])
	})
})

describe("getListingForEdit", () => {
	it("maps everything the editor needs", async () => {
		result.current = { data: editRow, error: null }
		const listing = await getListingForEdit("l1")

		expect(listing).toMatchObject({
			id: "l1",
			sellerId: "s1",
			status: "draft",
			category: { slug: "dogs", name: "Dogs" },
			breed: { id: 50, name: "Golden Retriever", specifiedPart: null },
			crossBreed: null,
			sex: "female",
			weightKg: 6.5,
			microchipNo: "900085000000004",
			source: "licensed_breeder",
			documentKinds: ["vaccination_card"],
		})
		expect(listing?.healthRecords.map((record) => record.id)).toEqual(["h1", "h2"])
		expect(listing?.documents.vaccination_card.fileName).toBe("new.pdf")
	})

	it("tolerates missing detail rows", async () => {
		result.current = {
			data: { ...editRow, details: [], private: null, pet_health_records: [], listing_documents: [] },
			error: null,
		}
		expect(await getListingForEdit("l1")).toMatchObject({
			breed: null,
			sex: null,
			sterilised: false,
			microchipNo: null,
			source: null,
			healthRecords: [],
			documentKinds: [],
		})
	})

	it("returns null when the listing isn't visible", async () => {
		expect(await getListingForEdit("missing")).toBeNull()
	})
})

describe("errors", () => {
	it.each([
		["breeds", () => listBreeds()],
		["listings", () => listSellerListings("s1")],
		["listing", () => getListingForEdit("l1")],
	])("throws when %s fail to load", async (label, load) => {
		result.current = { data: null, error: { message: "down" } }
		await expect(load()).rejects.toThrow(`Failed to load ${label}: down`)
	})
})
