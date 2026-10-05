import type { ListingForEdit } from "@/lib/listings/queries"
import { sellerCanList } from "@/lib/listings/rules"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LISTING_ID, makeListing } from "./fixtures/listing"
import { makeSeller } from "./fixtures/seller"

vi.mock("server-only", () => ({}))
const seller = makeSeller({ status: "verified" })
const state = vi.hoisted(() => ({ listing: null as ListingForEdit | null, requested: [] as string[] }))
vi.mock("@/lib/sellers/queries", () => ({ requireSeller: async () => seller }))
vi.mock("@/lib/listings/queries", () => ({
	getListingForEdit: async (id: string) => {
		state.requested.push(id)
		return state.listing
	},
}))
vi.mock("next/navigation", () => ({
	notFound: () => {
		throw new Error("NEXT_NOT_FOUND")
	},
}))

const { listingPath, requireOwnListing } = await import("@/lib/listings/session")

beforeEach(() => {
	state.listing = null
	state.requested = []
})

describe("requireOwnListing", () => {
	it("returns the seller's own listing", async () => {
		state.listing = makeListing({ sellerId: seller.id })
		await expect(requireOwnListing(LISTING_ID)).resolves.toEqual({ seller, listing: state.listing })
		expect(listingPath(LISTING_ID)).toBe(`/seller/listings/${LISTING_ID}`)
	})

	it("404s for another seller's listing, an unknown id or a malformed one", async () => {
		state.listing = makeListing({ sellerId: "someone-else" })
		await expect(requireOwnListing(LISTING_ID)).rejects.toThrow("NEXT_NOT_FOUND")
		state.listing = null
		await expect(requireOwnListing(LISTING_ID)).rejects.toThrow("NEXT_NOT_FOUND")
		await expect(requireOwnListing("nope")).rejects.toThrow("NEXT_NOT_FOUND")
		expect(state.requested).toEqual([LISTING_ID, LISTING_ID])
	})
})

describe("sellerCanList", () => {
	const today = "2026-10-05"

	it.each([
		["a verified seller licensed for dogs", {}, true],
		["a pending seller", { status: "pending" as const }, false],
		["an expired licence", { licenceExpiresOn: "2026-10-04" }, false],
		["no licence date", { licenceExpiresOn: null }, false],
		["no dog licence", { species: [] }, false],
	])("%s → %s", (_label, override, expected) => {
		expect(sellerCanList({ ...seller, ...override }, today)).toBe(expected)
	})
})
