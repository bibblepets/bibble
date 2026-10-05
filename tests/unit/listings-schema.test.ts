import { animalSchema, healthRecordSchema, listingSchema, microchipSchema, sourceSchema } from "@/lib/listings/schema"
import { describe, expect, it } from "vitest"

const today = "2026-10-05"
const firstError = (result: { error?: { issues: { message: string }[] } }) => result.error?.issues[0]?.message

describe("animalSchema", () => {
	const animal = {
		breedId: "50",
		crossBreedId: "",
		sex: "female",
		colour: " Golden ",
		dateOfBirth: "2026-07-27",
		readyDate: "2026-10-05",
		weightKg: "6.5",
		heightCm: "",
	}

	it("parses form values", () => {
		expect(animalSchema(today).parse({ ...animal, sterilised: "on" })).toEqual({
			breedId: 50,
			crossBreedId: null,
			sex: "female",
			colour: "Golden",
			dateOfBirth: "2026-07-27",
			readyDate: "2026-10-05",
			weightKg: 6.5,
			heightCm: null,
			sterilised: true,
		})
		expect(animalSchema(today).parse(animal).sterilised).toBe(false)
	})

	it.each([
		[{ breedId: "" }, "Choose a breed."],
		[{ crossBreedId: "50" }, "Choose a different breed for a cross, or leave it empty."],
		[{ sex: "" }, "Choose the sex."],
		[{ colour: " " }, "Enter the colour."],
		[{ dateOfBirth: "2026-10-06" }, "This date is in the future."],
		[{ readyDate: "" }, "Enter the date the puppy can go home."],
		[{ readyDate: "2026-07-01" }, "The ready date can't be before the date of birth."],
		[{ weightKg: "heavy" }, "Enter the weight as a number."],
		[{ weightKg: "200" }, "That weight looks too large."],
		[{ heightCm: "30.25" }, "Use at most one decimal place."],
	])("rejects %j", (override, message) => {
		expect(firstError(animalSchema(today).safeParse({ ...animal, ...override }))).toBe(message)
	})

	it("defaults to today in Singapore", () => {
		expect(animalSchema().safeParse({ ...animal, dateOfBirth: "2999-01-01", readyDate: "2999-03-01" }).success).toBe(
			false
		)
	})
})

describe("listingSchema", () => {
	it.each([
		["3500", 350000],
		["$3,500.50", 350050],
		[" 4 200 ", 420000],
	])("reads the price %j", (priceCents, cents) => {
		expect(listingSchema.parse({ title: "Lovely puppy", priceCents, description: "" })).toEqual({
			title: "Lovely puppy",
			priceCents: cents,
			description: null,
		})
	})

	it.each([
		[{ priceCents: "free" }, "Enter a price in dollars, e.g. 3500."],
		[{ priceCents: "0.50" }, "Enter a price of at least $1."],
		[{ priceCents: "2000000" }, "That price looks too high."],
		[{ title: "Pup" }, "Use at least 5 characters."],
		[{ description: "x".repeat(2001) }, "Use 2,000 characters or fewer."],
	])("rejects %j", (override, message) => {
		expect(
			firstError(listingSchema.safeParse({ title: "Lovely puppy", priceCents: "3500", description: "", ...override }))
		).toBe(message)
	})
})

describe("microchipSchema", () => {
	it("accepts 15 digits with spaces", () => {
		expect(microchipSchema.parse({ microchipNo: "900 085 000 000 004" }).microchipNo).toBe("900085000000004")
	})

	it("rejects anything else", () => {
		expect(firstError(microchipSchema.safeParse({ microchipNo: "12345" }))).toBe("Enter the 15-digit microchip number.")
	})
})

describe("healthRecordSchema", () => {
	it("parses a record", () => {
		expect(
			healthRecordSchema(today).parse({ kind: "vaccination", givenOn: "2026-09-21", product: " Nobivac ", clinic: "" })
		).toEqual({ kind: "vaccination", givenOn: "2026-09-21", product: "Nobivac", clinic: null })
	})

	it.each([
		[{ kind: "booster" }, "Choose vaccination or deworming."],
		[{ givenOn: "2026-10-06" }, "This date is in the future."],
		[{ product: "" }, "Enter the vaccine or dewormer."],
	])("rejects %j", (override, message) => {
		const record = { kind: "deworming", givenOn: "2026-09-01", product: "Drontal", clinic: "", ...override }
		expect(firstError(healthRecordSchema(today).safeParse(record))).toBe(message)
	})

	it("defaults to today", () => {
		expect(
			healthRecordSchema().safeParse({ kind: "deworming", givenOn: "2999-01-01", product: "x", clinic: "" }).success
		).toBe(false)
	})
})

describe("sourceSchema", () => {
	it("only accepts bred on premises from breeders", () => {
		expect(sourceSchema("breeder", today).safeParse({ source: "bred_on_premises" }).success).toBe(true)
		expect(firstError(sourceSchema("breeder", today).safeParse({ source: "licensed_breeder" }))).toBe(
			"Breeders can only sell animals they bred."
		)
	})

	it("needs the breeder licence or import details from pet shops", () => {
		const shop = sourceSchema("pet_shop", today)
		expect(shop.parse({ source: "licensed_breeder", sourceLicenceNo: " br25008 " })).toEqual({
			source: "licensed_breeder",
			sourceLicenceNo: "BR25008",
		})
		expect(shop.parse({ source: "imported", importPermitNo: "IMP-1", arrivalDate: "2026-09-20" })).toMatchObject({
			source: "imported",
		})
		expect(firstError(shop.safeParse({ source: "licensed_breeder", sourceLicenceNo: "?" }))).toMatch(/licence number/)
		expect(firstError(shop.safeParse({ source: "imported", importPermitNo: "", arrivalDate: "2026-09-20" }))).toBe(
			"Enter the import permit number."
		)
		expect(firstError(shop.safeParse({ source: "imported", importPermitNo: "IMP", arrivalDate: "2026-10-06" }))).toBe(
			"This date is in the future."
		)
		expect(firstError(shop.safeParse({ source: "" }))).toBe("Choose where the animal comes from.")
	})

	it("defaults to today", () => {
		expect(
			sourceSchema("pet_shop").safeParse({ source: "imported", importPermitNo: "IMP", arrivalDate: "2999-01-01" })
				.success
		).toBe(false)
	})
})
