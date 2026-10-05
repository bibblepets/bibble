import { expect, test } from "@playwright/test"
import { formAlert, logIn, logOut, openMenu, password, signUp } from "./helpers/auth"
import { authLinkFor, uniqueEmail } from "./helpers/mailpit"

test("sign up, confirm by email, log out and log back in", async ({ page, request }) => {
	const email = uniqueEmail("signup")
	await signUp(page, email, "Ella Tan")

	// Logging in before confirming is refused with guidance.
	await logIn(page, email)
	await expect(formAlert(page)).toContainText("Confirm your email first")

	await page.goto(await authLinkFor(request, email, /Confirm your Bibble account/))
	await expect(page).toHaveURL("/")
	await expect(page.getByRole("banner").getByRole("button", { name: "Open menu" })).toContainText("ET")

	await expect(await openMenu(page)).toContainText("Ella Tan")
	await page.keyboard.press("Escape")
	await logOut(page)
	await expect(page.getByRole("banner").getByRole("button", { name: "Open menu" })).not.toContainText("ET")

	await logIn(page, email)
	await expect(page).toHaveURL("/")
	await expect(await openMenu(page)).toContainText(email)
})

test("wrong password shows an error and keeps the email", async ({ page }) => {
	await logIn(page, "alice@bibble.test", "wrong-password1")

	await expect(formAlert(page)).toContainText("don't match")
	await expect(page.getByLabel("Email")).toHaveValue("alice@bibble.test")
})

test("invalid sign-up input is flagged on the field", async ({ page }) => {
	await page.goto("/signup")
	await page.getByLabel("Name").fill("Short Pass")
	await page.getByLabel("Email").fill(uniqueEmail("invalid"))
	await page.getByLabel("Password").fill("short")
	await page.getByRole("button", { name: "Create account" }).click()

	await expect(page.getByLabel("Password")).toHaveAttribute("aria-invalid", "true")
	await expect(page.getByText("Use at least 8 characters.")).toBeVisible()
})

test("forgot password resets via the emailed link", async ({ page, request }) => {
	const email = uniqueEmail("reset")
	await signUp(page, email)
	await page.goto(await authLinkFor(request, email, /Confirm your Bibble account/))
	await logOut(page)

	await page.goto("/forgot-password")
	await page.getByLabel("Email").fill(email)
	await page.getByRole("button", { name: "Send reset link" }).click()
	await expect(page.getByText(/reset your password/)).toBeVisible()

	await page.goto(await authLinkFor(request, email, /Reset your Bibble password/))
	await expect(page).toHaveURL("/reset-password")
	await page.getByLabel("New password", { exact: true }).fill("newpass456")
	await page.getByLabel("Confirm new password").fill("newpass456")
	await page.getByRole("button", { name: "Update password" }).click()
	await expect(page).toHaveURL("/")

	await logOut(page)
	await logIn(page, email, "newpass456")
	await expect(page).toHaveURL("/")
	await expect(await openMenu(page)).toContainText(email)
})

test("forgot password doesn't reveal unknown emails", async ({ page }) => {
	await page.goto("/forgot-password")
	await page.getByLabel("Email").fill(uniqueEmail("nobody"))
	await page.getByRole("button", { name: "Send reset link" }).click()

	await expect(page.getByText(/If an account exists/)).toBeVisible()
})

test("log in honours a same-site next and ignores an off-site one", async ({ page }) => {
	await page.goto("/login?next=/auth/error")
	await page.getByLabel("Email").fill("bob@bibble.test")
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: "Log in" }).click()
	await expect(page).toHaveURL("/auth/error")

	await page.context().clearCookies()
	await page.goto("/login?next=//evil.com")
	await page.getByLabel("Email").fill("bob@bibble.test")
	await page.getByLabel("Password").fill(password)
	await page.getByRole("button", { name: "Log in" }).click()
	await expect(page).toHaveURL("/")
})

test("reset password page requires a session", async ({ page }) => {
	await page.goto("/reset-password")
	await expect(page).toHaveURL("/login?next=%2Freset-password")
})

test("confirm link with a bad token lands on the error page", async ({ page }) => {
	await page.goto("/auth/confirm?token_hash=bogus&type=email")
	await expect(page.getByRole("heading", { name: /couldn.t sign you in/i })).toBeVisible()
})
