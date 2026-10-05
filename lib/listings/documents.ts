export const LISTING_DOCUMENTS_BUCKET = "listing-documents"

export const listingDocumentKinds = ["vaccination_card", "import_permit"] as const
export type ListingDocumentKind = (typeof listingDocumentKinds)[number]

export const listingDocumentLabels: Record<ListingDocumentKind, { title: string; description: string }> = {
	vaccination_card: {
		title: "Vaccination card",
		description:
			"The card that goes home with the puppy, showing the microchip number, breed, sex, date of birth and each vaccination signed by the vet.",
	},
	import_permit: {
		title: "Import permit",
		description: "The AVS import permit for this animal.",
	},
}
