import { defineConfig, devices } from "@playwright/test"

const PORT = 3000
const isCI = !!process.env.CI

/** E2E smoke tests. Requires local Supabase (`npm run db:start`) and a production build (`npm run build`). */
export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	reporter: isCI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: `npm run start -- --port ${PORT}`,
		url: `http://localhost:${PORT}/api/health`,
		reuseExistingServer: !isCI,
		timeout: 60_000,
	},
})
