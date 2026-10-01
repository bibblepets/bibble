import { GENERIC_AUTH_ERROR } from "@/lib/auth/errors"
import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = vi.hoisted(() => ({
	signUp: vi.fn(),
	signInWithPassword: vi.fn(),
	signOut: vi.fn(),
	resetPasswordForEmail: vi.fn(),
	updateUser: vi.fn(),
}))
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth }) }))

class RedirectError extends Error {}
const redirect = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({ redirect }))
const revalidatePath = vi.hoisted(() => vi.fn())
vi.mock("next/cache", () => ({ revalidatePath }))

const { logIn, logOut, requestPasswordReset, resetPassword, signUp } = await import("@/lib/auth/actions")

function form(fields: Record<string, string>) {
	const formData = new FormData()
	for (const [key, value] of Object.entries(fields)) formData.set(key, value)
	return formData
}

/** Runs an action, turning `redirect()` into a returned path like Next.js does. */
async function run<T>(action: () => Promise<T>): Promise<T | { redirectedTo: string }> {
	try {
		return await action()
	} catch (error) {
		if (error instanceof RedirectError) return { redirectedTo: error.message }
		throw error
	}
}

beforeEach(() => {
	vi.clearAllMocks()
	redirect.mockImplementation((path: string) => {
		throw new RedirectError(path)
	})
	for (const fn of Object.values(auth)) fn.mockResolvedValue({ data: {}, error: null })
})

describe("signUp", () => {
	const valid = { displayName: "Alice", email: "Alice@Bibble.test", password: "password123" }

	it("creates the account with the display name and asks the user to check their email", async () => {
		expect(await run(() => signUp({}, form(valid)))).toEqual({ redirectedTo: "/check-email?for=signup" })
		expect(auth.signUp).toHaveBeenCalledWith({
			email: "alice@bibble.test",
			password: "password123",
			options: { data: { display_name: "Alice" } },
		})
	})

	it("returns field errors and keeps non-secret values", async () => {
		const result = await signUp({}, form({ ...valid, password: "short" }))
		expect(result).toEqual({
			fieldErrors: { password: "Use at least 8 characters." },
			values: { displayName: "Alice", email: "Alice@Bibble.test" },
		})
		expect(auth.signUp).not.toHaveBeenCalled()
	})

	it("maps Supabase errors", async () => {
		auth.signUp.mockResolvedValue({ data: {}, error: { code: "weak_password" } })
		expect(await signUp({}, form(valid))).toMatchObject({ formError: expect.stringMatching(/stronger password/) })
	})
})

describe("logIn", () => {
	it("signs in and returns to a safe next path", async () => {
		const result = await run(() => logIn({}, form({ email: "a@b.test", password: "x", next: "/seller" })))
		expect(result).toEqual({ redirectedTo: "/seller" })
		expect(revalidatePath).toHaveBeenCalledWith("/", "layout")
	})

	it("ignores an off-site next", async () => {
		const result = await run(() => logIn({}, form({ email: "a@b.test", password: "x", next: "//evil.com" })))
		expect(result).toEqual({ redirectedTo: "/" })
	})

	it("defaults to home without next", async () => {
		expect(await run(() => logIn({}, form({ email: "a@b.test", password: "x" })))).toEqual({ redirectedTo: "/" })
	})

	it("shows a friendly error for bad credentials", async () => {
		auth.signInWithPassword.mockResolvedValue({ data: {}, error: { code: "invalid_credentials" } })
		const result = await logIn({}, form({ email: "a@b.test", password: "wrong" }))
		expect(result).toEqual({ formError: expect.stringMatching(/don't match/), values: { email: "a@b.test" } })
	})

	it("validates input before calling Supabase", async () => {
		expect(await logIn({}, form({ email: "nope", password: "" }))).toMatchObject({
			fieldErrors: { email: "Enter a valid email address.", password: "Enter your password." },
		})
		expect(auth.signInWithPassword).not.toHaveBeenCalled()
	})
})

describe("logOut", () => {
	it("signs out and goes home", async () => {
		expect(await run(() => logOut())).toEqual({ redirectedTo: "/" })
		expect(auth.signOut).toHaveBeenCalledOnce()
		expect(revalidatePath).toHaveBeenCalledWith("/", "layout")
	})
})

describe("requestPasswordReset", () => {
	it("always reports success for unknown or failing emails", async () => {
		auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: { code: "user_not_found" } })
		const result = await run(() => requestPasswordReset({}, form({ email: "who@bibble.test" })))
		expect(result).toEqual({ redirectedTo: "/check-email?for=reset" })
	})

	it("surfaces rate limiting", async () => {
		auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: { code: "over_email_send_rate_limit" } })
		expect(await requestPasswordReset({}, form({ email: "a@b.test" }))).toMatchObject({
			formError: expect.stringMatching(/too many emails/),
		})
	})

	it("validates the email", async () => {
		expect(await requestPasswordReset({}, form({ email: "nope" }))).toMatchObject({
			fieldErrors: { email: "Enter a valid email address." },
		})
	})
})

describe("resetPassword", () => {
	it("updates the password and goes home", async () => {
		const result = await run(() => resetPassword({}, form({ password: "newpass123", confirmPassword: "newpass123" })))
		expect(result).toEqual({ redirectedTo: "/" })
		expect(auth.updateUser).toHaveBeenCalledWith({ password: "newpass123" })
	})

	it("reports mismatched passwords without echoing them", async () => {
		const result = await resetPassword({}, form({ password: "newpass123", confirmPassword: "other123" }))
		expect(result).toEqual({ fieldErrors: { confirmPassword: "Passwords don't match." } })
	})

	it("maps Supabase errors", async () => {
		auth.updateUser.mockResolvedValue({ data: {}, error: { code: "unexpected_failure" } })
		const result = await resetPassword({}, form({ password: "newpass123", confirmPassword: "newpass123" }))
		expect(result).toEqual({ formError: GENERIC_AUTH_ERROR })
	})
})
