import "server-only"

import { getCurrentUser, requireUser, type CurrentUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { cache } from "react"

/** Whether the signed-in user is a platform admin. Memoised per request. */
export const isPlatformAdmin = cache(async (): Promise<boolean> => {
	if (!(await getCurrentUser())) {
		return false
	}
	const supabase = await createClient()
	const { data, error } = await supabase.rpc("is_platform_admin")
	if (error) {
		throw new Error(`Failed to check admin access: ${error.message}`)
	}
	return data === true
})

/**
 * Guards admin pages and actions: signed-out users go to log in; everyone else who isn't an admin gets a 404, so
 * the console isn't advertised. The database functions check again on every write.
 */
export async function requireAdmin(returnTo: string): Promise<CurrentUser> {
	const user = await requireUser(returnTo)
	if (!(await isPlatformAdmin())) {
		notFound()
	}
	return user
}
