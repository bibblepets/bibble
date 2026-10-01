import { env } from "@/lib/env"
import type { Database } from "@/types/database"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/** Refreshes the Supabase auth session and forwards updated cookies to the browser. */
export async function updateSession(request: NextRequest) {
	let response = NextResponse.next({ request })

	const supabase = createServerClient<Database>(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet, headers) {
					cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
					response = NextResponse.next({ request })
					cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
					// Prevent CDNs from caching responses that carry auth cookies.
					Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value))
				},
			},
		}
	)

	// Must run before any response is produced so a token refresh can write its cookies.
	await supabase.auth.getClaims()

	return response
}
