import { env } from "@/lib/env"
import type { Database } from "@/types/database"
import { createBrowserClient } from "@supabase/ssr"

/** Supabase client for Client Components. */
export function createClient() {
	return createBrowserClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
}
