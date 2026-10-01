import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

/** Exchanges an auth code (OAuth, magic link, email confirmation) for a session cookie. */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl
	const code = searchParams.get("code")
	const next = searchParams.get("next") ?? "/"
	// Only allow relative redirects to prevent open-redirects.
	const redirectPath = next.startsWith("/") && !next.startsWith("//") ? next : "/"

	if (code) {
		const supabase = await createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error) {
			return NextResponse.redirect(new URL(redirectPath, origin))
		}
	}

	return NextResponse.redirect(new URL("/auth/error", origin))
}
