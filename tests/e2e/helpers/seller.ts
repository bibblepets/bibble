import { expect, type APIRequestContext, type Browser, type Page } from "@playwright/test"
import path from "node:path"
import { logIn, signUpConfirmed } from "./auth"
import { uniqueEmail } from "./mailpit"

export const fixture = (name: string) => path.join(__dirname, "..", "fixtures", name)

/** A UEN no other run has used: 8 random digits + a letter. */
export function uniqueUen() {
	return `${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}A`
}

export function isoDate(daysFromNow: number) {
	return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function wizardNext(page: Page) {
	return page.getByRole("navigation", { name: "Steps" }).getByRole("button", { name: "Next" })
}

/**
 * Signs up a new user and takes them through the whole wizard to "pending", as a pet shop with a unique trading name.
 * Leaves them signed in on the seller dashboard.
 */
export async function onboardSeller(page: Page, request: APIRequestContext, label: string) {
	const tradingName = `${label} ${crypto.randomUUID().slice(0, 6)}`
	await signUpConfirmed(page, request, uniqueEmail(label.toLowerCase().replace(/\W+/g, "-")), "Seller Owner")

	await page.goto("/seller/onboarding/type")
	await page.getByText("Pet shop", { exact: true }).click()
	await wizardNext(page).click()

	await page.getByLabel("Trading name").fill(tradingName)
	await page.getByLabel("Registered business name").fill(`${tradingName} Pte. Ltd.`)
	await page.getByLabel("UEN").fill(uniqueUen())
	await page.getByLabel("AVS pet shop licence number").fill("AS24A00999")
	await page.getByLabel("Licence expiry date").fill(isoDate(200))
	await wizardNext(page).click()

	await page.getByLabel("Address", { exact: true }).fill("10 Tampines Central 1")
	await page.getByLabel("Postal code").fill("529536")
	await page.getByLabel("Area").selectOption({ label: "Tampines" })
	await page.getByLabel("Phone").fill("6789 1234")
	await wizardNext(page).click()

	for (const [title, file] of [
		["AVS licence", "avs-licence.pdf"],
		["ACRA BizFile", "acra-bizfile.pdf"],
	]) {
		const tile = page.getByRole("region", { name: title })
		await tile.locator("input[type=file]").setInputFiles(fixture(file))
		await expect(tile).toContainText(file)
	}
	await page.getByRole("navigation", { name: "Steps" }).getByRole("link", { name: "Next" }).click()
	await page.getByRole("button", { name: "Submit for verification" }).click()
	await expect(page.getByRole("status", { name: "Verification status" })).toContainText("We're reviewing")

	return { tradingName }
}

/** Has carol (the seeded admin) approve a pending seller through the admin console, in her own browser context. */
export async function approveSeller(browser: Browser, tradingName: string) {
	const admin = await (await browser.newContext()).newPage()
	await logIn(admin, "carol@bibble.test")
	await expect(admin).toHaveURL("/")
	await admin.goto("/admin/sellers?status=pending")
	await admin.getByRole("link", { name: tradingName }).click()
	const panel = admin.getByRole("region", { name: "Decision" })
	await expect(panel.getByRole("checkbox")).toHaveCount(6)
	for (const checkbox of await panel.getByRole("checkbox").all()) {
		await checkbox.check()
	}
	await panel.getByRole("button", { name: "Approve" }).click()
	await expect(admin.getByRole("region", { name: "History" })).toContainText("Approved")
	await admin.context().close()
}
