import type { ListingForEdit } from "@/lib/listings/queries"
import type { CurrentSeller } from "@/lib/sellers/queries"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LISTING_ID, makeListing } from "./fixtures/listing"
import { makeSeller } from "./fixtures/seller"

type Result = { data?: unknown; error: { code?: string; message?: string } | null; count?: number }
const db = vi.hoisted(() => ({
	results: {} as Record<string, Result>,
	calls: [] as unknown[][],
	info: { data: { size: 2048, contentType: "application/pdf" }, error: null } as Result,
}))

vi.mock("@/lib/supabase/server", () => ({
	createClient: async () => ({
		from(table: string) {
			let operation = ""
			const builder: Record<string, unknown> = {}
			for (const method of ["update", "delete", "insert", "eq"]) {
				builder[method] = (...args: unknown[]) => {
					if (method !== "eq") operation = method
					db.calls.push([table, method, ...args])
					return builder
				}
			}
			builder.then = (resolve: (value: Result) => void) =>
				resolve(db.results[`${table}.${operation}`] ?? { error: null })
			return builder
		},
		async rpc(name: string, args: unknown) {
			db.calls.push(["rpc", name, args])
			return db.results[`rpc.${name}`] ?? { data: null, error: null }
		},
		storage: { from: () => ({ info: async () => db.info }) },
	}),
}))

const state = vi.hoisted(() => ({
	seller: null as CurrentSeller | null,
	listing: null as ListingForEdit | null,
}))
vi.mock("@/lib/listings/session", () => ({
	listingPath: (id: string) => `/seller/listings/${id}`,
	requireOwnListing: async () => {
		if (!state.listing) throw new Error("NEXT_NOT_FOUND")
		return { seller: state.seller, listing: state.listing }
	},
}))
vi.mock("@/lib/sellers/queries", () => ({ requireSeller: async () => state.seller }))
vi.mock("@/lib/auth/session", () => ({ requireUser: async () => ({ id: "user-1" }) }))

class Redirect extends Error {}
vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Redirect(path)
	},
}))
const revalidatePath = vi.hoisted(() => vi.fn())
vi.mock("next/cache", () => ({ revalidatePath }))

const actions = await import("@/lib/listings/actions")

function form(fields: Record<string, string>) {
	const formData = new FormData()
	for (const [key, value] of Object.entries(fields)) formData.set(key, value)
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

beforeEach(() => {
	state.seller = makeSeller({ status: "verified" })
	state.listing = makeListing()
	db.results = {}
	db.calls = []
	db.info = { data: { size: 2048, contentType: "application/pdf" }, error: null }
	revalidatePath.mockClear()
})

describe("createListing", () => {
	it("creates a dog draft and opens the editor", async () => {
		db.results["rpc.create_listing"] = { data: LISTING_ID, error: null }
		expect(await run(() => actions.createListing())).toEqual({ redirectedTo: `/seller/listings/${LISTING_ID}` })
		expect(db.calls).toContainEqual(["rpc", "create_listing", { p_seller_id: state.seller!.id, p_category: "dogs" }])
	})

	it("reports errors", async () => {
		db.results["rpc.create_listing"] = { error: { message: "category_unavailable" } }
		expect((await actions.createListing()).formError).toMatch(/can't create listings in this category/)
	})
})

describe("section saves", () => {
	it("saves the animal details", async () => {
		const result = await actions.saveAnimal(
			LISTING_ID,
			{},
			form({
				breedId: "50",
				sex: "female",
				colour: "Golden",
				dateOfBirth: "2026-07-27",
				readyDate: "2026-10-05",
				weightKg: "6.5",
				sterilised: "on",
			})
		)
		expect(result).toEqual({ saved: true })
		expect(db.calls).toContainEqual([
			"pet_listing_details",
			"update",
			{
				breed_id: 50,
				cross_breed_id: null,
				sex: "female",
				colour: "Golden",
				date_of_birth: "2026-07-27",
				ready_date: "2026-10-05",
				weight_kg: 6.5,
				height_cm: null,
				sterilised: true,
			},
		])
		expect(revalidatePath).toHaveBeenCalledWith(`/seller/listings/${LISTING_ID}`)
	})

	it("returns animal field errors with the submitted values", async () => {
		const result = await actions.saveAnimal(LISTING_ID, {}, form({ breedId: "", colour: "Red" }))
		expect(result.fieldErrors?.breedId).toBe("Choose a breed.")
		expect(result.values?.colour).toBe("Red")
	})

	it("reports database errors such as a locked listing", async () => {
		db.results["pet_listing_details.update"] = { error: { message: "listing_locked" } }
		const result = await actions.saveAnimal(
			LISTING_ID,
			{},
			form({ breedId: "50", sex: "male", colour: "Red", dateOfBirth: "2026-07-27", readyDate: "2026-10-05" })
		)
		expect(result.formError).toMatch(/can't be edited right now/)
	})

	it("saves title, price and description", async () => {
		expect(await actions.saveListingInfo(LISTING_ID, {}, form({ title: "Lovely pup", priceCents: "3,600" }))).toEqual({
			saved: true,
		})
		expect(db.calls).toContainEqual([
			"listings",
			"update",
			{ title: "Lovely pup", price_cents: 360000, description: null },
		])
		expect(
			(await actions.saveListingInfo(LISTING_ID, {}, form({ title: "Pup", priceCents: "1" }))).fieldErrors?.title
		).toBe("Use at least 5 characters.")
	})

	it("saves the microchip privately", async () => {
		expect(await actions.saveMicrochip(LISTING_ID, {}, form({ microchipNo: "900 085 000 123 456" }))).toEqual({
			saved: true,
		})
		expect(db.calls).toContainEqual(["pet_listing_private", "update", { microchip_no: "900085000123456" }])
		expect(
			(await actions.saveMicrochip(LISTING_ID, {}, form({ microchipNo: "123" }))).fieldErrors?.microchipNo
		).toBeTruthy()
	})

	it("adds and removes health records", async () => {
		expect(
			await actions.addHealthRecord(
				LISTING_ID,
				{},
				form({ kind: "vaccination", givenOn: "2026-09-21", product: "DHPPi" })
			)
		).toEqual({ saved: true })
		expect(db.calls).toContainEqual([
			"pet_health_records",
			"insert",
			{ listing_id: LISTING_ID, kind: "vaccination", given_on: "2026-09-21", product: "DHPPi", clinic: null },
		])
		expect(
			(await actions.addHealthRecord(LISTING_ID, {}, form({ kind: "vaccination" }))).fieldErrors?.givenOn
		).toBeTruthy()

		expect(await actions.removeHealthRecord(LISTING_ID, "h1")).toEqual({})
		expect(db.calls).toContainEqual(["pet_health_records", "eq", "id", "h1"])
		db.results["pet_health_records.delete"] = { error: { message: "listing_locked" } }
		expect((await actions.removeHealthRecord(LISTING_ID, "h1")).error).toMatch(/can't be edited/)
	})

	it("saves a pet shop's sources and clears the fields of the other source", async () => {
		await actions.saveSource(LISTING_ID, {}, form({ source: "licensed_breeder", sourceLicenceNo: "br25001" }))
		expect(db.calls).toContainEqual([
			"pet_listing_private",
			"update",
			{ source: "licensed_breeder", source_licence_no: "BR25001", import_permit_no: null, arrival_date: null },
		])
		await actions.saveSource(
			LISTING_ID,
			{},
			form({ source: "imported", importPermitNo: "IMP-1", arrivalDate: "2026-09-01" })
		)
		expect(db.calls).toContainEqual([
			"pet_listing_private",
			"update",
			{ source: "imported", source_licence_no: null, import_permit_no: "IMP-1", arrival_date: "2026-09-01" },
		])
	})

	it("only accepts bred on premises from breeders", async () => {
		state.seller = makeSeller({ sellerType: "breeder" })
		expect((await actions.saveSource(LISTING_ID, {}, form({ source: "imported" }))).fieldErrors?.source).toBe(
			"Breeders can only sell animals they bred."
		)
		expect(await actions.saveSource(LISTING_ID, {}, form({ source: "bred_on_premises" }))).toEqual({ saved: true })
	})
})

describe("recordListingDocument", () => {
	const upload = { storagePath: `${LISTING_ID}/0b9d6a2e-1c2f-4e2a-9d8b-2d1a3c4b5e6f.pdf`, fileName: "card.pdf" }

	it("records the upload with size and type from Storage", async () => {
		expect(await actions.recordListingDocument(LISTING_ID, "vaccination_card", upload)).toEqual({})
		expect(db.calls).toContainEqual([
			"listing_documents",
			"insert",
			{
				listing_id: LISTING_ID,
				kind: "vaccination_card",
				storage_path: upload.storagePath,
				file_name: "card.pdf",
				content_type: "application/pdf",
				size_bytes: 2048,
				uploaded_by: "user-1",
			},
		])
	})

	it.each([
		["another folder", { storagePath: "other/file.pdf" }, "vaccination_card"],
		["an unknown kind", {}, "passport"],
		["a blank name", { fileName: " " }, "vaccination_card"],
	])("refuses %s", async (_label, override, kind) => {
		const result = await actions.recordListingDocument(LISTING_ID, kind as "vaccination_card", {
			...upload,
			...override,
		})
		expect(result.error).toMatch(/doesn't look right/)
	})

	it("refuses missing or wrong files and reports insert errors", async () => {
		db.info = { data: null, error: { message: "not found" } }
		expect((await actions.recordListingDocument(LISTING_ID, "vaccination_card", upload)).error).toMatch(/couldn't find/)
		db.info = { data: { size: 5, contentType: "text/html" }, error: null }
		expect((await actions.recordListingDocument(LISTING_ID, "vaccination_card", upload)).error).toBe(
			"Upload a PDF, JPG or PNG."
		)
		db.info = { data: { size: 5, contentType: "image/png" }, error: null }
		db.results["listing_documents.insert"] = { error: { message: "listing_locked" } }
		expect((await actions.recordListingDocument(LISTING_ID, "import_permit", upload)).error).toMatch(/can't be edited/)
	})
})

describe("status changes", () => {
	it.each([
		["submit", "submit_listing_for_review", {}],
		["revise", "revise_listing", {}],
		["archive", "archive_listing", {}],
		["reserve", "set_listing_availability", { p_status: "reserved" }],
		["unreserve", "set_listing_availability", { p_status: "published" }],
		["sell", "set_listing_availability", { p_status: "sold" }],
	] as const)("%s calls %s", async (action, fn, extra) => {
		expect(await actions.changeListingStatus(LISTING_ID, action)).toEqual({})
		expect(db.calls).toContainEqual(["rpc", fn, { p_listing_id: LISTING_ID, ...extra }])
	})

	it("explains refusals", async () => {
		db.results["rpc.submit_listing_for_review"] = { error: { message: "too_young_at_handover" } }
		expect((await actions.changeListingStatus(LISTING_ID, "submit")).error).toMatch(/9 weeks/)
	})

	it("deletes drafts that were never submitted", async () => {
		db.results["listings.delete"] = { error: null, count: 1 }
		expect(await run(() => actions.deleteDraft(LISTING_ID))).toEqual({ redirectedTo: "/seller/listings" })
	})

	it("explains when a listing can't be deleted", async () => {
		db.results["listings.delete"] = { error: null, count: 0 }
		expect((await actions.deleteDraft(LISTING_ID))?.error).toMatch(/Archive it instead/)
	})

	it("refuses other sellers' listings", async () => {
		state.listing = null
		await expect(actions.changeListingStatus(LISTING_ID, "submit")).rejects.toThrow("NEXT_NOT_FOUND")
	})
})
