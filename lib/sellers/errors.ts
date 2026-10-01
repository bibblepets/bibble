/** Messages for the exceptions raised by the seller functions in the create_sellers migration. */
const messages: Record<string, string> = {
	seller_already_exists: "You already have a seller account.",
	invalid_species: "Choose at least one kind of animal we support.",
	seller_details_locked:
		"Your business type, legal name, UEN, licence number and animals can't be changed after submitting. Contact us to update them.",
	not_a_member: "You don't have access to this seller account.",
	already_submitted: "Your details have already been submitted.",
	missing_business_details: "Some business details are missing. Check the business step.",
	licence_expired: "Your AVS licence has expired. Update the expiry date once you've renewed it.",
	missing_contact_details: "Some address or contact details are missing. Check the location step.",
	missing_species: "Choose the animals your licence covers.",
	missing_documents: "Upload both your AVS licence and your ACRA BizFile.",
}

export const GENERIC_SELLER_ERROR = "Something went wrong saving your details. Please try again."

/** A user-facing message for a Postgres error from a seller write. Our functions raise their code as the message. */
export function sellerErrorMessage(error: { message?: string } | null | undefined): string {
	return (error?.message && messages[error.message]) || GENERIC_SELLER_ERROR
}

/** Unique violation on sellers.uen. */
export function isDuplicateUen(error: { code?: string; message?: string } | null | undefined): boolean {
	return error?.code === "23505" && Boolean(error.message?.includes("sellers_uen_key"))
}
