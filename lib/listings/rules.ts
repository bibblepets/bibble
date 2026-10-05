import type { SellerStatus } from "@/lib/sellers/progress"
import type { SellerType } from "@/lib/sellers/schema"

/**
 * AVS thresholds, mirroring submit_listing_for_review() in the create_listings migration (change both together).
 * The database is the authority; these give the editor early feedback.
 */
export const LISTING_RULES = {
	minHandoverDays: 63,
	vaccinationRestDays: 7,
	importRestDays: 3,
	minVaccinations: 2,
	minDewormings: 2,
} as const

const DAY_MS = 24 * 60 * 60 * 1000

/** Adds days to a YYYY-MM-DD date. */
export function addDays(date: string, days: number): string {
	return new Date(Date.parse(`${date}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)
}

/** Whole days from `from` to `to` (both YYYY-MM-DD). */
export function daysBetween(from: string, to: string): number {
	return Math.round((Date.parse(to) - Date.parse(from)) / DAY_MS)
}

/** The earliest date an animal born on `dateOfBirth` may go home (9 weeks). */
export function earliestHandover(dateOfBirth: string): string {
	return addDays(dateOfBirth, LISTING_RULES.minHandoverDays)
}

/** Age for display, e.g. "10 weeks" or "5 months". */
export function formatAge(dateOfBirth: string, today: string): string {
	const days = Math.max(0, daysBetween(dateOfBirth, today))
	if (days < 7) return `${days} day${days === 1 ? "" : "s"}`
	const weeks = Math.floor(days / 7)
	if (weeks < 16) return `${weeks} week${weeks === 1 ? "" : "s"}`
	const months = Math.floor(days / 30.44)
	if (months < 24) return `${months} months`
	return `${Math.floor(months / 12)} years`
}

export type EditorSection = "animal" | "listing" | "health" | "source" | "documents"

export type ListingIssueCode =
	| "missing_details"
	| "invalid_dates"
	| "restricted_breed"
	| "too_young_at_handover"
	| "vaccinations_incomplete"
	| "deworming_incomplete"
	| "invalid_source"
	| "missing_vaccination_card"
	| "missing_import_permit"
	| "seller_cannot_list"

export type ListingIssue = { code: ListingIssueCode; section: EditorSection | null; message: string }

/** What the rules need to know about a listing. */
export type ListingRuleInput = {
	title: string | null
	priceCents: number | null
	breed: { specifiedPart: number | null } | null
	crossBreed: { specifiedPart: number | null } | null
	sex: string | null
	dateOfBirth: string | null
	readyDate: string | null
	colour: string | null
	microchipNo: string | null
	source: string | null
	sourceLicenceNo: string | null
	importPermitNo: string | null
	arrivalDate: string | null
	healthRecords: { kind: "vaccination" | "deworming"; givenOn: string }[]
	documentKinds: readonly string[]
}

/**
 * Every rule a listing currently breaks, so the editor can show a full checklist. The database stops at the first
 * failure, in the same order.
 */
export function submitIssues(
	listing: ListingRuleInput,
	seller: { sellerType: SellerType; canList: boolean },
	today: string
): ListingIssue[] {
	const issues: ListingIssue[] = []
	const add = (code: ListingIssueCode, section: EditorSection | null, message: string) =>
		issues.push({ code, section, message })
	const { dateOfBirth, readyDate } = listing

	if (!seller.canList) {
		add("seller_cannot_list", null, "Your business must be verified, with a licence in date, before you can submit.")
	}

	const missingAnimal = !listing.breed || !listing.sex || !dateOfBirth || !readyDate || !listing.colour
	if (missingAnimal) add("missing_details", "animal", "Add the breed, sex, colour, date of birth and ready date.")
	if (!listing.title || !listing.priceCents) add("missing_details", "listing", "Add a title and price.")
	if (!listing.microchipNo) add("missing_details", "health", "Add the microchip number.")
	if (!listing.source) add("missing_details", "source", "Tell us where the animal comes from.")

	const recordOutOfRange =
		dateOfBirth && listing.healthRecords.some((record) => record.givenOn < dateOfBirth || record.givenOn > today)
	if ((dateOfBirth && (dateOfBirth > today || (readyDate && readyDate < dateOfBirth))) || recordOutOfRange) {
		add(
			"invalid_dates",
			recordOutOfRange ? "health" : "animal",
			"Check the dates: they must fall between birth and today."
		)
	}

	if ([listing.breed, listing.crossBreed].some((breed) => breed?.specifiedPart === 1)) {
		add("restricted_breed", "animal", "This breed is a Specified Dog (Part 1) and can't be sold in Singapore.")
	}

	if (dateOfBirth && readyDate && readyDate < earliestHandover(dateOfBirth)) {
		add(
			"too_young_at_handover",
			"animal",
			`Puppies can't go home before 9 weeks. The earliest ready date is ${earliestHandover(dateOfBirth)}.`
		)
	}

	const vaccinations = listing.healthRecords.filter((record) => record.kind === "vaccination").map((r) => r.givenOn)
	const lastVaccination = vaccinations.toSorted().at(-1)
	if (
		vaccinations.length < LISTING_RULES.minVaccinations ||
		(lastVaccination && readyDate && addDays(lastVaccination, LISTING_RULES.vaccinationRestDays) > readyDate)
	) {
		add(
			"vaccinations_incomplete",
			"health",
			"Add at least 2 vaccinations, the last one at least 7 days before the ready date."
		)
	}
	if (listing.healthRecords.filter((record) => record.kind === "deworming").length < LISTING_RULES.minDewormings) {
		add("deworming_incomplete", "health", "Add at least 2 dewormings.")
	}

	if (listing.source && !sourceIsValid(listing, seller.sellerType, readyDate)) {
		add(
			"invalid_source",
			"source",
			seller.sellerType === "breeder"
				? "Breeders can only sell animals they bred."
				: "Give the breeder's licence number, or the import permit and an arrival date at least 72 hours before handover."
		)
	}

	if (!listing.documentKinds.includes("vaccination_card")) {
		add("missing_vaccination_card", "documents", "Upload the vaccination card.")
	}
	if (listing.source === "imported" && !listing.documentKinds.includes("import_permit")) {
		add("missing_import_permit", "documents", "Upload the import permit.")
	}

	return issues
}

function sourceIsValid(listing: ListingRuleInput, sellerType: SellerType, readyDate: string | null): boolean {
	if (sellerType === "breeder") {
		return listing.source === "bred_on_premises"
	}
	if (listing.source === "licensed_breeder") {
		return Boolean(listing.sourceLicenceNo)
	}
	if (listing.source === "imported") {
		return Boolean(
			listing.importPermitNo &&
			listing.arrivalDate &&
			readyDate &&
			readyDate >= addDays(listing.arrivalDate, LISTING_RULES.importRestDays)
		)
	}
	return false
}

/** Sections that still have something to fix. */
export function incompleteSections(issues: ListingIssue[]): Set<EditorSection> {
	return new Set(issues.flatMap((issue) => (issue.section ? [issue.section] : [])))
}

/** Whether the seller may submit dog listings now: verified, licence in date, licensed for dogs. Mirrors seller_can_list(). */
export function sellerCanList(
	seller: { status: SellerStatus; licenceExpiresOn: string | null; species: { slug: string }[] },
	today: string
): boolean {
	return (
		seller.status === "verified" &&
		Boolean(seller.licenceExpiresOn && seller.licenceExpiresOn >= today) &&
		seller.species.some((species) => species.slug === "dog")
	)
}
