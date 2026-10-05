/** Messages for the exceptions raised by the listing functions and triggers in the create_listings migration. */
const messages: Record<string, string> = {
	not_a_member: "You don't have access to this listing.",
	category_unavailable: "You can't create listings in this category yet.",
	invalid_transition: "This listing's status has changed. Reload the page and try again.",
	listing_locked: "This listing can't be edited right now. Revise it first if it's live.",
	breed_species_mismatch: "Choose a breed of the right animal.",
	seller_cannot_list: "Your business must be verified, with a licence in date, before you can do that.",
	missing_details: "Some required details are missing.",
	invalid_dates: "Check the dates: they must fall between the date of birth and today.",
	restricted_breed: "This breed is a Specified Dog (Part 1) and can't be sold in Singapore.",
	too_young_at_handover: "Puppies can't go home before 9 weeks. Move the ready date later.",
	vaccinations_incomplete: "Add at least 2 vaccinations, the last one at least 7 days before the ready date.",
	deworming_incomplete: "Add at least 2 dewormings.",
	invalid_source: "Check where the animal comes from.",
	missing_vaccination_card: "Upload the vaccination card.",
	missing_import_permit: "Upload the import permit.",
}

export const GENERIC_LISTING_ERROR = "Something went wrong saving your listing. Please try again."

export function listingErrorMessage(error: { message?: string } | null | undefined): string {
	return (error?.message && messages[error.message]) || GENERIC_LISTING_ERROR
}
