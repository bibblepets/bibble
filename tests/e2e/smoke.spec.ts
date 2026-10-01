import { expect, test } from "@playwright/test"

test("home page renders", async ({ page }) => {
	await page.goto("/")

	await expect(page).toHaveTitle("Bibble")
	await expect(page.getByRole("heading", { level: 1, name: "Bibble" })).toBeVisible()
	await expect(page.getByRole("region", { name: "Categories" })).toBeVisible()
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
