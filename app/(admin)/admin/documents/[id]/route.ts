import { signedDocumentUrl } from "@/lib/admin/queries"
import { isPlatformAdmin } from "@/lib/admin/session"
import { getCurrentUser } from "@/lib/auth/session"
import { NextResponse, type NextRequest } from "next/server"

/** Opens a seller document for an admin by redirecting to a 60-second signed URL. Links open it in a new tab. */
export async function GET(request: NextRequest, { params }: RouteContext<"/admin/documents/[id]">) {
	const { id } = await params
	if (!(await getCurrentUser())) {
		return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(request.nextUrl.pathname)}`, request.url))
	}
	if (!(await isPlatformAdmin())) {
		return new NextResponse("Not found", { status: 404 })
	}

	const url = await signedDocumentUrl(id)
	if (!url) {
		return new NextResponse("This document's file couldn't be found.", { status: 404 })
	}
	return NextResponse.redirect(url)
}
