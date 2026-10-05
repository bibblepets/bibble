"use client"

import { FileUpload } from "@/components/forms/file-upload"
import { recordListingDocument } from "@/lib/listings/actions"
import { LISTING_DOCUMENTS_BUCKET, listingDocumentLabels, type ListingDocumentKind } from "@/lib/listings/documents"
import type { ListingForEdit } from "@/lib/listings/queries"

/** Vaccination card, and the import permit for imported animals. Private to the seller and Bibble. */
export function ListingDocuments({ listing, editable }: { listing: ListingForEdit; editable: boolean }) {
	const kinds: ListingDocumentKind[] =
		listing.source === "imported" ? ["vaccination_card", "import_permit"] : ["vaccination_card"]

	return (
		<div className="grid gap-4">
			{kinds.map((kind) =>
				editable ? (
					<FileUpload
						key={kind}
						bucket={LISTING_DOCUMENTS_BUCKET}
						folder={listing.id}
						{...listingDocumentLabels[kind]}
						current={listing.documents[kind]}
						record={(upload) => recordListingDocument(listing.id, kind, upload)}
					/>
				) : (
					<p key={kind}>
						<span className="font-medium">{listingDocumentLabels[kind].title}:</span>{" "}
						{listing.documents[kind]?.fileName ?? "Not uploaded"}
					</p>
				)
			)}
		</div>
	)
}
