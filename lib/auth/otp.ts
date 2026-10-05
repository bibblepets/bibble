/** Email link types app/auth/confirm accepts. Matches the templates in supabase/templates. */
const confirmTypes = ["email", "recovery"] as const

export type ConfirmType = (typeof confirmTypes)[number]

export type ConfirmParams = { tokenHash: string; type: ConfirmType; next: string | null }

/** Reads `token_hash`, `type` and `next` from an email confirmation link, or null if the link is malformed. */
export function parseConfirmParams(searchParams: URLSearchParams): ConfirmParams | null {
	const tokenHash = searchParams.get("token_hash")
	const type = searchParams.get("type")

	if (!tokenHash || !confirmTypes.includes(type as ConfirmType)) {
		return null
	}
	return { tokenHash, type: type as ConfirmType, next: searchParams.get("next") }
}
