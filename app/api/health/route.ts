import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/** Liveness + database connectivity check, for uptime monitors and e2e smoke tests. */
export async function GET() {
	const supabase = await createClient()
	const { error } = await supabase.from("profiles").select("id", { count: "exact", head: true })

	if (error) {
		console.error("Health check failed:", error.message)
		return NextResponse.json({ status: "error", database: "unreachable" }, { status: 503 })
	}

	return NextResponse.json({ status: "ok", database: "ok" })
}
