import { parseEnv } from "@/lib/env"
import { describe, expect, it } from "vitest"

const valid = {
	NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
	NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
}

describe("parseEnv", () => {
	it("returns the parsed variables when valid", () => {
		expect(parseEnv(valid)).toEqual(valid)
	})

	it("throws when a variable is missing", () => {
		expect(() => parseEnv({ ...valid, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: undefined })).toThrow(
			/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/
		)
	})

	it("throws when the Supabase URL is not a URL", () => {
		expect(() => parseEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "not-a-url" })).toThrow(/NEXT_PUBLIC_SUPABASE_URL/)
	})
})
