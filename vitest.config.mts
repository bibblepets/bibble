import { defineConfig } from "vitest/config"

export default defineConfig({
	resolve: { tsconfigPaths: true },
	oxc: { jsx: { runtime: "automatic" } },
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		// lib/env.ts validates on import; unit tests never talk to a real Supabase.
		env: {
			NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
			NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
		},
		include: ["tests/unit/**/*.test.{ts,tsx}"],
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json-summary"],
			include: ["app/**/*.{ts,tsx}", "lib/**/*.ts", "components/**/*.tsx"],
			exclude: [
				// shadcn-generated primitives
				"components/ui/**",
				// Thin wiring that needs a live Next.js/Supabase runtime. Keep logic out of these files:
				// extract it into lib/ (e.g. lib/redirect.ts) where it is unit-tested and counted.
				"app/**/route.ts",
				"app/layout.tsx",
				"lib/supabase/**",
			],
			thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
		},
	},
})
