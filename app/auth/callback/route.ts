import { safeRedirectUrl } from "@/lib/redirect"
import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

/** Exchanges an auth code (OAuth, magic link, email confirmation) for a session cookie. */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl
	const code = searchParams.get("code")

	if (code) {
		const supabase = await createClient()
		const { error } = await supabase.auth.exchangeCodeForSession(code)
		if (!error) {
			return NextResponse.redirect(safeRedirectUrl(searchParams.get("next"), origin))
		}
	}

	return NextResponse.redirect(new URL("/auth/error", origin))
}
