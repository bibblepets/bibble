const messages: Record<string, string> = {
	invalid_credentials: "That email and password don't match. Try again or reset your password.",
	email_not_confirmed: "Confirm your email first. Check your inbox for the link we sent you.",
	weak_password: "Choose a stronger password: at least 8 characters with letters and numbers.",
	same_password: "Your new password must be different from your current one.",
	email_address_invalid: "Enter a valid email address.",
	over_email_send_rate_limit: "We've sent too many emails recently. Wait a few minutes and try again.",
	over_request_rate_limit: "Too many attempts. Wait a few minutes and try again.",
}

export const GENERIC_AUTH_ERROR = "Something went wrong. Please try again."

/** A message that is safe to show users for a Supabase `AuthError`. */
export function authErrorMessage(error: { code?: string } | null | undefined): string {
	return (error?.code && messages[error.code]) || GENERIC_AUTH_ERROR
}
