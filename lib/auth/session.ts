import "server-only"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cache } from "react"

export type CurrentUser = { id: string; email: string; displayName: string | null }

/** The signed-in user from verified JWT claims, or null. Memoised per request. */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
	const supabase = await createClient()
	const { data } = await supabase.auth.getClaims()
	const claims = data?.claims
	if (!claims) {
		return null
	}

	const displayName = claims.user_metadata?.display_name
	return {
		id: claims.sub,
		email: claims.email ?? "",
		displayName: typeof displayName === "string" && displayName ? displayName : null,
	}
})

/**
 * The signed-in user, or a redirect to log in that returns to `returnTo` afterwards.
 * Call it in every protected page and Server Action; layouts don't re-run on navigation.
 */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
	const user = await getCurrentUser()
	if (!user) {
		redirect(`/login?next=${encodeURIComponent(returnTo)}`)
	}
	return user
}
