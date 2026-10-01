import { expect, type APIRequestContext, type Page } from "@playwright/test"
import { authLinkFor } from "./mailpit"

/** Password of every seeded user, and of users the tests sign up. */
export const password = "password123"

export async function signUp(page: Page, email: string, name = "E2E Tester") {
	await page.goto("/signup")
	await page.getByLabel("Name").fill(name)
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: "Create account" }).click()
	await expect(page.getByRole("heading", { name: "Check your email" })).toBeVisible()
}

export async function logIn(page: Page, email: string, pass = password) {
	await page.goto("/login")
	await page.getByLabel("Email").fill(email)
	await page.getByLabel("Password").fill(pass)
	await page.getByRole("button", { name: "Log in" }).click()
}

export async function openMenu(page: Page) {
	await page.getByRole("banner").getByRole("button", { name: "Open menu" }).click()
	return page.getByRole("menu")
}

export async function logOut(page: Page) {
	await (await openMenu(page)).getByRole("menuitem", { name: "Log out" }).click()
	// Wait for the session cookie to go before navigating, or /login would bounce a still-signed-in user.
	await expect(async () => {
		const cookies = await page.context().cookies()
		expect(cookies.filter((cookie) => cookie.name.includes("auth-token"))).toEqual([])
	}).toPass()
}

/** The form's error, not Next.js's route announcer (which also has role="alert"). */
export function formAlert(page: Page) {
	return page.getByRole("main").getByRole("alert")
}

/** Signs up a new user, confirms the email through Mailpit, and leaves them signed in on the home page. */
export async function signUpConfirmed(page: Page, request: APIRequestContext, email: string, name = "E2E Tester") {
	await signUp(page, email, name)
	await page.goto(await authLinkFor(request, email, /Confirm your Bibble account/))
	await expect(page).toHaveURL("/")
}
