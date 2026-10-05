import type { ListingForEdit } from "@/lib/listings/queries"

export const LISTING_ID = "bbbbbbbb-0000-0000-0000-000000000099"

/** A draft listing with nothing filled in. */
export function makeListing(overrides: Partial<ListingForEdit> = {}): ListingForEdit {
	return {
		id: LISTING_ID,
		sellerId: "11111111-2222-3333-4444-555555555555",
		status: "draft",
		category: { slug: "dogs", name: "Dogs" },
		title: null,
		description: null,
		priceCents: null,
		submittedAt: null,
		publishedAt: null,
		updatedAt: "2026-10-05T00:00:00Z",
		breed: null,
		crossBreed: null,
		sex: null,
		dateOfBirth: null,
		readyDate: null,
		colour: null,
		weightKg: null,
		heightCm: null,
		sterilised: false,
		microchipNo: null,
		source: null,
		sourceLicenceNo: null,
		importPermitNo: null,
		arrivalDate: null,
		healthRecords: [],
		documents: {},
		documentKinds: [],
		images: [],
		imageCount: 0,
		...overrides,
	}
}
