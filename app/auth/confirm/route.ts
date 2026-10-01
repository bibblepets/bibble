import { parseConfirmParams } from "@/lib/auth/otp"
import { safeRedirectUrl } from "@/lib/redirect"
import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Verifies the token_hash links in our auth emails (sign-up confirmation, password recovery) and signs the user in.
 * Unlike the PKCE code in app/auth/callback, these work when the link is opened on another device.
 */
export async function GET(request: NextRequest) {
	const { searchParams, origin } = request.nextUrl
	const params = parseConfirmParams(searchParams)

	if (params) {
		const supabase = await createClient()
		const { error } = await supabase.auth.verifyOtp({ type: params.type, token_hash: params.tokenHash })
		if (!error) {
			return NextResponse.redirect(safeRedirectUrl(params.next, origin))
		}
	}

	return NextResponse.redirect(new URL("/auth/error", origin))
}
