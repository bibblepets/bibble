/** Messages for the exceptions raised by the admin functions in the seller_reviews migration. */
const messages: Record<string, string> = {
	not_an_admin: "You don't have permission to do that.",
	seller_not_found: "This seller no longer exists.",
	invalid_transition: "This seller's status has changed since you opened the page. Reload and try again.",
	message_required: "Tell the seller why. They'll see this message.",
	checklist_incomplete: "Tick every check before approving.",
	licence_expired: "This seller's licence has expired, so they can't be approved.",
	note_required: "Explain the correction for the audit trail.",
	invalid_species: "Choose at least one species we support.",
}

export const GENERIC_ADMIN_ERROR = "Something went wrong. Please try again."

export function adminErrorMessage(error: { message?: string } | null | undefined): string {
	return (error?.message && messages[error.message]) || GENERIC_ADMIN_ERROR
}
