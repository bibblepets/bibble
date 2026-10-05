import "server-only"

import { requireSeller, type CurrentSeller } from "@/lib/sellers/queries"
import { notFound } from "next/navigation"
import { getListingForEdit, type ListingForEdit } from "./queries"

export function listingPath(listingId: string): string {
	return `/seller/listings/${listingId}`
}

/** The signed-in seller and one of their own listings, or a 404. RLS already hides other sellers' drafts. */
export async function requireOwnListing(
	listingId: string
): Promise<{ seller: CurrentSeller; listing: ListingForEdit }> {
	const seller = await requireSeller(listingPath(listingId))
	const listing = /^[0-9a-f-]{36}$/i.test(listingId) ? await getListingForEdit(listingId) : null
	if (!listing || listing.sellerId !== seller.id) {
		notFound()
	}
	return { seller, listing }
}
