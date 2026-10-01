import { todayInSingapore } from "@/lib/dates"
import { businessStepSchema, licenceExample, locationStepSchema, typeStepSchema } from "@/lib/sellers/schema"
import { describe, expect, it } from "vitest"

const today = "2026-10-02"
const business = {
	displayName: "Pawsome Kennels",
	legalName: "Pawsome Kennels Pte. Ltd.",
	uen: "202301234K",
	licenceNo: "BR25008",
	licenceExpiresOn: "2027-01-31",
}

function firstError(result: { error?: { issues: { message: string }[] } }) {
	return result.error?.issues[0]?.message
}

describe("todayInSingapore", () => {
	it("uses Singapore time, not UTC", () => {
		// 20:00 UTC on 1 Oct is 04:00 on 2 Oct in Singapore.
		expect(todayInSingapore(new Date("2026-10-01T20:00:00Z"))).toBe("2026-10-02")
	})
})

describe("typeStepSchema", () => {
	it("accepts a seller type with species", () => {
		expect(typeStepSchema.parse({ sellerType: "breeder", species: ["dog"] })).toEqual({
			sellerType: "breeder",
			species: ["dog"],
		})
	})

	it.each([
		[{ sellerType: "vet", species: ["dog"] }, "Choose the kind of business you run."],
		[{ sellerType: "pet_shop", species: [] }, "Choose at least one kind of animal your licence covers."],
	])("rejects %j", (input, message) => {
		expect(firstError(typeStepSchema.safeParse(input))).toBe(message)
	})
})

describe("businessStepSchema", () => {
	it("normalises UEN and licence number to upper case", () => {
		const result = businessStepSchema("breeder", today).parse({
			...business,
			uen: " 202301234k ",
			licenceNo: "br25008",
		})
		expect(result).toMatchObject({ uen: "202301234K", licenceNo: "BR25008" })
	})

	it.each(["53123456A", "202301234K", "T08LL0001A", "S99FC1234Z"])("accepts UEN %s", (uen) => {
		expect(businessStepSchema("breeder", today).safeParse({ ...business, uen }).success).toBe(true)
	})

	it.each(["12345", "2023012345K", "ABCDEFGHI", "A08LL0001A"])("rejects UEN %s", (uen) => {
		expect(firstError(businessStepSchema("breeder", today).safeParse({ ...business, uen }))).toMatch(/valid UEN/)
	})

	it("checks the licence format for the seller type", () => {
		expect(businessStepSchema("pet_shop", today).safeParse({ ...business, licenceNo: "AS19J00045" }).success).toBe(true)
		expect(businessStepSchema("pet_shop", today).safeParse({ ...business, licenceNo: "AS90M0570" }).success).toBe(true)
		expect(firstError(businessStepSchema("pet_shop", today).safeParse(business))).toMatch(/AS24A00123/)
		expect(
			firstError(businessStepSchema("breeder", today).safeParse({ ...business, licenceNo: "AS19J00045" }))
		).toMatch(/BR25008/)
	})

	it("allows a licence expiring today but not one already expired", () => {
		expect(businessStepSchema("breeder", today).safeParse({ ...business, licenceExpiresOn: today }).success).toBe(true)
		expect(
			firstError(businessStepSchema("breeder", today).safeParse({ ...business, licenceExpiresOn: "2026-10-01" }))
		).toMatch(/expired/)
	})

	it("requires a real date", () => {
		expect(firstError(businessStepSchema("breeder", today).safeParse({ ...business, licenceExpiresOn: "" }))).toBe(
			"Enter the licence expiry date."
		)
	})

	it("defaults to today's date in Singapore", () => {
		expect(businessStepSchema("breeder").safeParse({ ...business, licenceExpiresOn: "2000-01-01" }).success).toBe(false)
	})

	it("requires names", () => {
		const result = businessStepSchema("breeder", today).safeParse({ ...business, displayName: " ", legalName: "" })
		expect(result.error?.issues.map((issue) => issue.message)).toEqual([
			"Enter the name buyers will see.",
			"Enter the name registered with ACRA.",
		])
	})
})

describe("licenceExample", () => {
	it("gives an example per type", () => {
		expect(licenceExample("pet_shop")).toBe("AS24A00123")
		expect(licenceExample("breeder")).toBe("BR25008")
	})
})

describe("locationStepSchema", () => {
	const location = {
		addressLine1: "59 Sungei Tengah Road",
		addressLine2: "",
		postalCode: "699012",
		areaId: "30",
		contactPhone: "9123 4567",
		contactEmail: "Alice@Bibble.test",
		about: "  ",
	}

	it("normalises phone, email, area and empty optional fields", () => {
		expect(locationStepSchema.parse(location)).toEqual({
			addressLine1: "59 Sungei Tengah Road",
			addressLine2: null,
			postalCode: "699012",
			areaId: 30,
			contactPhone: "+6591234567",
			contactEmail: "alice@bibble.test",
			about: null,
		})
	})

	it.each(["+65 6789-1234", "+6581234567", "31234567"])("accepts phone %s", (contactPhone) => {
		expect(locationStepSchema.safeParse({ ...location, contactPhone }).success).toBe(true)
	})

	it.each(["1234567", "+6571234567", "+601234567890", "phone"])("rejects phone %s", (contactPhone) => {
		expect(firstError(locationStepSchema.safeParse({ ...location, contactPhone }))).toMatch(/Singapore phone/)
	})

	it.each([
		[{ postalCode: "12345" }, "Enter a 6-digit postal code."],
		[{ areaId: "" }, "Choose the area your premises are in."],
		[{ areaId: "abc" }, "Choose the area your premises are in."],
		[{ addressLine1: "" }, "Enter your premises address."],
		[{ about: "x".repeat(1001) }, "Use 1,000 characters or fewer."],
	])("rejects %j", (override, message) => {
		expect(firstError(locationStepSchema.safeParse({ ...location, ...override }))).toBe(message)
	})
})
