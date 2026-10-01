import { z } from "zod"

const envSchema = z.object({
	NEXT_PUBLIC_SUPABASE_URL: z.url(),
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(input: Record<string, string | undefined>): Env {
	const result = envSchema.safeParse(input)
	if (!result.success) {
		throw new Error(`Invalid environment variables:\n${z.prettifyError(result.error)}`)
	}
	return result.data
}

// NEXT_PUBLIC_* vars must be referenced statically so Next.js can inline them into the client bundle.
export const env = parseEnv({
	NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
})
