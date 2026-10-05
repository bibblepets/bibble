import { GENERIC_LISTING_ERROR, listingErrorMessage } from "@/lib/listings/errors"
import {
	addDays,
	daysBetween,
	earliestHandover,
	formatAge,
	incompleteSections,
	LISTING_RULES,
	submitIssues,
	type ListingRuleInput,
} from "@/lib/listings/rules"
import { formatPrice, isEditable, listingFilters, statusDisplay } from "@/lib/listings/status"
import type { SellerType } from "@/lib/sellers/schema"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

const today = "2026-10-05"
const shop: { sellerType: SellerType; canList: boolean } = { sellerType: "pet_shop", canList: true }

/** A listing that passes every rule for a pet shop. */
const complete: ListingRuleInput = {
	title: "Golden Retriever puppy",
	priceCents: 360000,
	breed: { specifiedPart: null },
	crossBreed: null,
	sex: "female",
	dateOfBirth: "2026-07-27",
	readyDate: "2026-10-05",
	colour: "Golden",
	microchipNo: "900085000000004",
	source: "licensed_breeder",
	sourceLicenceNo: "BR25001",
	importPermitNo: null,
	arrivalDate: null,
	healthRecords: [
		{ kind: "deworming", givenOn: "2026-08-10" },
		{ kind: "deworming", givenOn: "2026-08-24" },
		{ kind: "vaccination", givenOn: "2026-09-07" },
		{ kind: "vaccination", givenOn: "2026-09-21" },
	],
	documentKinds: ["vaccination_card"],
}

const codes = (listing: Partial<ListingRuleInput>, seller = shop) =>
	submitIssues({ ...complete, ...listing }, seller, today).map((issue) => issue.code)

describe("date helpers", () => {
	it("adds and counts days", () => {
		expect(addDays("2026-02-27", 2)).toBe("2026-03-01")
		expect(daysBetween("2026-10-01", "2026-10-05")).toBe(4)
		expect(earliestHandover("2026-08-01")).toBe("2026-10-03")
	})

	it.each([
		["2026-10-04", "1 day"],
		["2026-10-01", "4 days"],
		["2026-09-28", "1 week"],
		["2026-07-27", "10 weeks"],
		["2026-05-01", "5 months"],
		["2023-09-01", "3 years"],
		["2026-10-10", "0 days"],
	])("an animal born %s is %s old", (dob, age) => {
		expect(formatAge(dob, today)).toBe(age)
	})
})

describe("submitIssues", () => {
	it("passes a complete listing", () => {
		expect(submitIssues(complete, shop, today)).toEqual([])
	})

	it("matches the thresholds in the migration", () => {
		const dir = path.join(process.cwd(), "supabase/migrations")
		const sql = readFileSync(
			path.join(
				dir,
				readdirSync(dir).find((f) => f.endsWith("_create_listings.sql"))!
			),
			"utf8"
		)
		const constant = (name: string) => Number(new RegExp(`${name} constant integer := (\\d+)`).exec(sql)![1])

		expect(constant("c_min_handover_days")).toBe(LISTING_RULES.minHandoverDays)
		expect(constant("c_vaccination_rest_days")).toBe(LISTING_RULES.vaccinationRestDays)
		expect(constant("c_import_rest_days")).toBe(LISTING_RULES.importRestDays)
		expect(constant("c_min_vaccinations")).toBe(LISTING_RULES.minVaccinations)
		expect(constant("c_min_dewormings")).toBe(LISTING_RULES.minDewormings)
	})

	it("lists everything missing from a new draft, by section", () => {
		const issues = submitIssues(
			{
				...complete,
				title: null,
				priceCents: null,
				breed: null,
				sex: null,
				dateOfBirth: null,
				readyDate: null,
				colour: null,
				microchipNo: null,
				source: null,
				healthRecords: [],
				documentKinds: [],
			},
			{ sellerType: "pet_shop", canList: false },
			today
		)
		expect(issues.map((issue) => issue.code)).toEqual([
			"seller_cannot_list",
			"missing_details",
			"missing_details",
			"missing_details",
			"missing_details",
			"vaccinations_incomplete",
			"deworming_incomplete",
			"missing_vaccination_card",
		])
		expect([...incompleteSections(issues)]).toEqual(["animal", "listing", "health", "source", "documents"])
	})

	it.each([
		["a future birth date", { dateOfBirth: "2026-10-06" }, "invalid_dates"],
		["a ready date before birth", { readyDate: "2026-07-01" }, "invalid_dates"],
		[
			"a record before birth",
			{ healthRecords: [...complete.healthRecords, { kind: "deworming" as const, givenOn: "2026-07-01" }] },
			"invalid_dates",
		],
		["a Part 1 breed", { breed: { specifiedPart: 1 } }, "restricted_breed"],
		["a cross with a Part 1 breed", { crossBreed: { specifiedPart: 1 } }, "restricted_breed"],
		["handover before 9 weeks", { readyDate: "2026-09-27" }, "too_young_at_handover"],
		["one vaccination", { healthRecords: complete.healthRecords.slice(0, 3) }, "vaccinations_incomplete"],
		[
			"a vaccination too close to handover",
			{
				healthRecords: [...complete.healthRecords.slice(0, 3), { kind: "vaccination" as const, givenOn: "2026-10-01" }],
			},
			"vaccinations_incomplete",
		],
		["one deworming", { healthRecords: complete.healthRecords.slice(1) }, "deworming_incomplete"],
		["a breeder licence missing", { sourceLicenceNo: null }, "invalid_source"],
		["a pet shop claiming it bred the animal", { source: "bred_on_premises" }, "invalid_source"],
		["no vaccination card", { documentKinds: [] }, "missing_vaccination_card"],
	])("flags %s", (_label, listing, code) => {
		expect(codes(listing)).toContain(code)
	})

	it("checks imports: permit, arrival 72 hours before handover, and the permit document", () => {
		const imported = { source: "imported", sourceLicenceNo: null, importPermitNo: "IMP-1", arrivalDate: "2026-09-20" }
		expect(codes(imported)).toEqual(["missing_import_permit"])
		expect(codes({ ...imported, documentKinds: ["vaccination_card", "import_permit"] })).toEqual([])
		expect(
			codes({ ...imported, arrivalDate: "2026-10-03", documentKinds: ["vaccination_card", "import_permit"] })
		).toEqual(["invalid_source"])
		expect(codes({ ...imported, importPermitNo: null })).toContain("invalid_source")
		expect(codes({ source: "unknown" })).toContain("invalid_source")
	})

	it("only lets breeders sell animals they bred", () => {
		const breeder = { sellerType: "breeder" as const, canList: true }
		expect(codes({ source: "bred_on_premises" }, breeder)).toEqual([])
		const issue = submitIssues(complete, breeder, today).find((i) => i.code === "invalid_source")
		expect(issue?.message).toBe("Breeders can only sell animals they bred.")
	})
})

describe("status helpers", () => {
	it("labels every status and knows which are editable", () => {
		expect(statusDisplay.pending_review.label).toBe("In review")
		expect(isEditable("draft")).toBe(true)
		expect(isEditable("changes_requested")).toBe(true)
		expect(isEditable("published")).toBe(false)
		expect(listingFilters.active.statuses).toEqual(["published", "reserved"])
	})

	it("formats prices in SGD", () => {
		expect(formatPrice(380000)).toBe("$3,800")
		expect(formatPrice(380050)).toBe("$3,800.50")
	})
})

describe("listingErrorMessage", () => {
	it("maps database codes", () => {
		expect(listingErrorMessage({ message: "too_young_at_handover" })).toMatch(/9 weeks/)
		expect(listingErrorMessage({ message: "listing_locked" })).toMatch(/Revise/)
	})

	it.each([null, {}, { message: "boom" }])("falls back for %j", (error) => {
		expect(listingErrorMessage(error)).toBe(GENERIC_LISTING_ERROR)
	})
})
