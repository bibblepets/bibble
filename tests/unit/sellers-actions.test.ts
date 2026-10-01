import type { CurrentSeller } from "@/lib/sellers/queries"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeNewSeller, makeSeller } from "./fixtures/seller"

// --- Fake Supabase client -------------------------------------------------------------------------------------------
type Result = { data?: unknown; error: { code?: string; message?: string } | null }
const db = vi.hoisted(() => ({
	/** Results keyed by "<table>.<operation>", e.g. "sellers.update". Missing keys succeed. */
	results: {} as Record<string, Result>,
	/** Every call, as [table, operation, ...args] or ["rpc", name, args]. */
	calls: [] as unknown[][],
	rpc: { data: null, error: null } as Result,
	info: { data: { size: 2048, contentType: "application/pdf" }, error: null } as Result,
}))

vi.mock("@/lib/supabase/server", () => ({
	createClient: async () => ({
		from(table: string) {
			let operation = ""
			const builder: Record<string, unknown> = {}
			for (const method of ["update", "delete", "upsert", "insert", "eq", "not"]) {
				builder[method] = (...args: unknown[]) => {
					if (["update", "delete", "upsert", "insert"].includes(method)) operation = method
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
			return db.rpc
		},
		storage: {
			from: () => ({
				async info(path: string) {
					db.calls.push(["storage", "info", path])
					return db.info
				},
			}),
		},
	}),
}))

// --- Other dependencies ---------------------------------------------------------------------------------------------
const state = vi.hoisted(() => ({ seller: null as CurrentSeller | null }))
vi.mock("@/lib/sellers/queries", () => ({
	getCurrentSeller: async () => state.seller,
	requireSeller: async () => {
		if (!state.seller) throw new Error("NEXT_REDIRECT /seller/onboarding")
		return state.seller
	},
	listSpecies: async () => [
		{ id: 1, slug: "dog", name: "Dogs", isActive: true },
		{ id: 2, slug: "cat", name: "Cats", isActive: false },
	],
}))
vi.mock("@/lib/auth/session", () => ({
	requireUser: async () => ({ id: "user-1", email: "a@b.test", displayName: null }),
}))

class Redirect extends Error {}
vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Redirect(path)
	},
}))
const revalidatePath = vi.hoisted(() => vi.fn())
vi.mock("next/cache", () => ({ revalidatePath }))

const actions = await import("@/lib/sellers/actions")

function form(fields: Record<string, string | string[]>) {
	const formData = new FormData()
	for (const [key, value] of Object.entries(fields)) {
		for (const v of Array.isArray(value) ? value : [value]) formData.append(key, v)
	}
	return formData
}

async function run<T>(action: () => Promise<T>): Promise<T | { redirectedTo: string }> {
	try {
		return await action()
	} catch (error) {
		if (error instanceof Redirect) return { redirectedTo: error.message }
		throw error
	}
}

const future = "2099-01-01"

beforeEach(() => {
	state.seller = null
	db.results = {}
	db.calls = []
	db.rpc = { data: null, error: null }
	db.info = { data: { size: 2048, contentType: "application/pdf" }, error: null }
	revalidatePath.mockClear()
})

describe("saveTypeStep", () => {
	it("creates the seller on the first save", async () => {
		const result = await run(() => actions.saveTypeStep({}, form({ sellerType: "breeder", species: ["dog"] })))
		expect(result).toEqual({ redirectedTo: "/seller/onboarding/business" })
		expect(db.calls).toContainEqual(["rpc", "create_seller", { p_seller_type: "breeder", p_species: ["dog"] }])
	})

	it("goes to the dashboard on save & exit", async () => {
		const result = await run(() =>
			actions.saveTypeStep({}, form({ sellerType: "breeder", species: "dog", intent: "exit" }))
		)
		expect(result).toEqual({ redirectedTo: "/seller" })
	})

	it("validates the choice", async () => {
		expect(await actions.saveTypeStep({}, form({ sellerType: "vet" }))).toMatchObject({
			fieldErrors: { sellerType: "Choose the kind of business you run.", species: expect.any(String) },
			values: { sellerType: "vet" },
		})
	})

	it("reports create_seller errors", async () => {
		db.rpc = { error: { message: "seller_already_exists" } }
		expect(await actions.saveTypeStep({}, form({ sellerType: "breeder", species: "dog" }))).toEqual({
			formError: "You already have a seller account.",
		})
	})

	it("updates an existing seller and clears the licence when the type changes", async () => {
		state.seller = makeSeller({ sellerType: "pet_shop" })
		const result = await run(() => actions.saveTypeStep({}, form({ sellerType: "breeder", species: "dog" })))

		expect(result).toEqual({ redirectedTo: "/seller/onboarding/business" })
		expect(db.calls).toContainEqual(["sellers", "update", { seller_type: "breeder", licence_no: null }])
		expect(db.calls).toContainEqual(["seller_species", "not", "species_id", "in", "(1)"])
		expect(db.calls).toContainEqual([
			"seller_species",
			"upsert",
			[{ seller_id: state.seller.id, species_id: 1 }],
			{ onConflict: "seller_id,species_id", ignoreDuplicates: true },
		])
	})

	it("keeps the licence when the type is unchanged", async () => {
		state.seller = makeSeller({ sellerType: "pet_shop" })
		await run(() => actions.saveTypeStep({}, form({ sellerType: "pet_shop", species: "dog" })))
		expect(db.calls).toContainEqual(["sellers", "update", { seller_type: "pet_shop" }])
	})

	it("refuses inactive species for an existing seller", async () => {
		state.seller = makeSeller()
		expect(await actions.saveTypeStep({}, form({ sellerType: "pet_shop", species: "cat" }))).toEqual({
			fieldErrors: { species: "Choose at least one kind of animal we support." },
		})
	})

	it("reports update errors", async () => {
		state.seller = makeSeller()
		db.results["seller_species.upsert"] = { error: { message: "seller_details_locked" } }
		expect(await actions.saveTypeStep({}, form({ sellerType: "pet_shop", species: "dog" }))).toMatchObject({
			formError: expect.stringMatching(/can't be changed/),
		})
	})

	it("sends submitted sellers to the dashboard", async () => {
		state.seller = makeSeller({ status: "pending" })
		expect(await run(() => actions.saveTypeStep({}, form({ sellerType: "pet_shop", species: "dog" })))).toEqual({
			redirectedTo: "/seller",
		})
	})
})

describe("saveBusinessStep", () => {
	const business = {
		displayName: "Happy Paws",
		legalName: "Happy Paws Trading",
		uen: "53123456a",
		licenceNo: "as24a00123",
		licenceExpiresOn: future,
	}

	beforeEach(() => {
		state.seller = makeNewSeller()
	})

	it("saves normalised details and moves on", async () => {
		expect(await run(() => actions.saveBusinessStep({}, form(business)))).toEqual({
			redirectedTo: "/seller/onboarding/location",
		})
		expect(db.calls).toContainEqual([
			"sellers",
			"update",
			{
				display_name: "Happy Paws",
				legal_name: "Happy Paws Trading",
				uen: "53123456A",
				licence_no: "AS24A00123",
				licence_expires_on: future,
			},
		])
	})

	it("checks the licence format for the seller's type", async () => {
		const result = await actions.saveBusinessStep({}, form({ ...business, licenceNo: "BR25008" }))
		expect(result.fieldErrors?.licenceNo).toMatch(/AS24A00123/)
		expect(result.values?.licenceNo).toBe("BR25008")
	})

	it("flags a UEN that's already registered", async () => {
		db.results["sellers.update"] = { error: { code: "23505", message: "sellers_uen_key" } }
		expect((await actions.saveBusinessStep({}, form(business))).fieldErrors?.uen).toMatch(/already registered/)
	})

	it("reports other errors", async () => {
		db.results["sellers.update"] = { error: { message: "seller_details_locked" } }
		expect((await actions.saveBusinessStep({}, form(business))).formError).toMatch(/can't be changed/)
	})

	it("only works while the wizard is editable", async () => {
		state.seller = makeSeller({ status: "verified" })
		expect(await run(() => actions.saveBusinessStep({}, form(business)))).toEqual({ redirectedTo: "/seller" })
	})
})

const location = {
	addressLine1: "201 Tampines Street 21",
	addressLine2: "",
	postalCode: "521201",
	planningAreaId: "28",
	contactPhone: "6789 1234",
	contactEmail: "dave@bibble.test",
	about: "",
}

describe("saveLocationStep", () => {
	beforeEach(() => {
		state.seller = makeNewSeller()
	})

	it("saves public and private details separately", async () => {
		expect(await run(() => actions.saveLocationStep({}, form(location)))).toEqual({
			redirectedTo: "/seller/onboarding/documents",
		})
		expect(db.calls).toContainEqual(["sellers", "update", { planning_area_id: 28, about: null }])
		expect(db.calls).toContainEqual([
			"seller_private_details",
			"update",
			{
				address_line1: "201 Tampines Street 21",
				address_line2: null,
				postal_code: "521201",
				contact_phone: "+6567891234",
				contact_email: "dave@bibble.test",
			},
		])
	})

	it("returns field errors with the submitted values", async () => {
		const result = await actions.saveLocationStep({}, form({ ...location, postalCode: "12" }))
		expect(result).toMatchObject({
			fieldErrors: { postalCode: "Enter a 6-digit postal code." },
			values: { postalCode: "12" },
		})
	})

	it("reports save errors", async () => {
		db.results["seller_private_details.update"] = { error: { message: "boom" } }
		expect((await actions.saveLocationStep({}, form(location))).formError).toMatch(/Something went wrong/)
	})
})

describe("recordSellerDocument", () => {
	const upload = () => ({
		kind: "avs_licence" as const,
		storagePath: `${state.seller!.id}/0b9d6a2e-1c2f-4e2a-9d8b-2d1a3c4b5e6f.pdf`,
		fileName: " licence.pdf ",
	})

	beforeEach(() => {
		state.seller = makeNewSeller()
	})

	it("records the upload with size and type from Storage", async () => {
		expect(await actions.recordSellerDocument(upload())).toEqual({})
		expect(db.calls).toContainEqual([
			"seller_documents",
			"insert",
			{
				seller_id: state.seller!.id,
				kind: "avs_licence",
				storage_path: upload().storagePath,
				file_name: "licence.pdf",
				content_type: "application/pdf",
				size_bytes: 2048,
				uploaded_by: "user-1",
			},
		])
		expect(revalidatePath).toHaveBeenCalled()
	})

	it.each([
		["another seller's folder", { storagePath: "someone-else/file.pdf" }],
		["a path outside the folder", { storagePath: "../file.pdf" }],
		["an unknown kind", { kind: "passport" }],
		["a blank file name", { fileName: "  " }],
	])("refuses %s", async (_label, override) => {
		const result = await actions.recordSellerDocument({ ...upload(), ...override } as ReturnType<typeof upload>)
		expect(result.error).toMatch(/doesn't look right/)
		expect(db.calls.some(([table]) => table === "seller_documents")).toBe(false)
	})

	it("refuses uploads Storage doesn't have", async () => {
		db.info = { data: null, error: { message: "not found" } }
		expect((await actions.recordSellerDocument(upload())).error).toMatch(/couldn't find your upload/)
	})

	it("refuses files Storage reports as the wrong type", async () => {
		db.info = { data: { size: 10, contentType: "text/html" }, error: null }
		expect((await actions.recordSellerDocument(upload())).error).toBe("Upload a PDF, JPG or PNG.")
	})

	it("reports insert errors", async () => {
		db.results["seller_documents.insert"] = { error: { message: "boom" } }
		expect((await actions.recordSellerDocument(upload())).error).toMatch(/Something went wrong/)
	})
})

describe("submitForVerification", () => {
	beforeEach(() => {
		state.seller = makeSeller()
	})

	it("submits and returns to the dashboard", async () => {
		expect(await run(() => actions.submitForVerification())).toEqual({ redirectedTo: "/seller" })
		expect(db.calls).toContainEqual(["rpc", "submit_seller_for_verification", { p_seller_id: state.seller!.id }])
	})

	it("explains what's missing", async () => {
		db.rpc = { error: { message: "missing_documents" } }
		expect(await actions.submitForVerification()).toEqual({
			formError: "Upload both your AVS licence and your ACRA BizFile.",
		})
	})
})

describe("updateSellerProfile", () => {
	const profile = { ...location, displayName: "Happy Paws Pets", licenceExpiresOn: future }

	it("saves editable fields only", async () => {
		state.seller = makeSeller({ status: "verified" })
		expect(await run(() => actions.updateSellerProfile({}, form(profile)))).toEqual({ redirectedTo: "/seller" })
		expect(db.calls).toContainEqual([
			"sellers",
			"update",
			{ planning_area_id: 28, about: null, display_name: "Happy Paws Pets", licence_expires_on: future },
		])
	})

	it("sends sellers who haven't submitted to the wizard", async () => {
		state.seller = makeNewSeller()
		expect(await run(() => actions.updateSellerProfile({}, form(profile)))).toEqual({
			redirectedTo: "/seller/onboarding",
		})
	})

	it("validates input", async () => {
		state.seller = makeSeller({ status: "verified" })
		const result = await actions.updateSellerProfile({}, form({ ...profile, licenceExpiresOn: "2000-01-01" }))
		expect(result.fieldErrors?.licenceExpiresOn).toMatch(/expired/)
	})

	it("reports save errors", async () => {
		state.seller = makeSeller({ status: "verified" })
		db.results["sellers.update"] = { error: { message: "boom" } }
		expect((await actions.updateSellerProfile({}, form(profile))).formError).toMatch(/Something went wrong/)
	})
})
