import { expect, test } from "@playwright/test"

test("home page renders", async ({ page }) => {
	await page.goto("/")

	await expect(page).toHaveTitle("Bibble")
	await expect(page.getByRole("heading", { level: 1, name: "Bibble" })).toBeVisible()
	await expect(page.getByRole("region", { name: "Categories" })).toBeVisible()
})

test("header shows the logo, seller link and user menu on desktop", async ({ page }) => {
	await page.goto("/")

	const header = page.getByRole("banner")
	await expect(header.getByRole("link", { name: "Bibble home" })).toBeVisible()
	await expect(header.getByRole("link", { name: "Become a seller" })).toBeVisible()

	await header.getByRole("button", { name: "Open menu" }).click()
	await expect(page.getByRole("menuitem", { name: "Log in" })).toBeVisible()
	await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden()
})

test("mobile shows the bottom tab bar", async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 })
	await page.goto("/")

	const tabs = page.getByRole("navigation", { name: "Primary" })
	await expect(tabs).toBeVisible()
	await expect(tabs.getByRole("link", { name: "Explore" })).toHaveAttribute("aria-current", "page")
	await expect(page.getByRole("banner").getByRole("link", { name: "Become a seller" })).toBeHidden()
})

test("serves the brand icons", async ({ request }) => {
	for (const path of ["/icon.png", "/apple-icon.png", "/favicon.ico", "/brand/logo.png"]) {
		expect((await request.get(path)).ok(), path).toBe(true)
	}
})

test("health check reports the database as reachable", async ({ request }) => {
	const response = await request.get("/api/health")

	expect(response.ok()).toBe(true)
	expect(await response.json()).toEqual({ status: "ok", database: "ok" })
})

test("unknown routes render the not-found page", async ({ page }) => {
	const response = await page.goto("/does-not-exist")

	expect(response?.status()).toBe(404)
	await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible()
})
