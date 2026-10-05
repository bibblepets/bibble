import { authErrorMessage, GENERIC_AUTH_ERROR } from "@/lib/auth/errors"
import { parseConfirmParams } from "@/lib/auth/otp"
import { describe, expect, it } from "vitest"

describe("authErrorMessage", () => {
	it("maps known Supabase error codes", () => {
		expect(authErrorMessage({ code: "invalid_credentials" })).toMatch(/don't match/)
		expect(authErrorMessage({ code: "email_not_confirmed" })).toMatch(/Confirm your email/)
	})

	it.each([null, undefined, {}, { code: "unexpected_failure" }])("falls back for %j", (error) => {
		expect(authErrorMessage(error)).toBe(GENERIC_AUTH_ERROR)
	})
})

describe("parseConfirmParams", () => {
	it("reads a confirmation link", () => {
		const params = new URLSearchParams("token_hash=abc&type=email&next=/")
		expect(parseConfirmParams(params)).toEqual({ tokenHash: "abc", type: "email", next: "/" })
	})

	it("reads a recovery link without next", () => {
		expect(parseConfirmParams(new URLSearchParams("token_hash=abc&type=recovery"))).toEqual({
			tokenHash: "abc",
			type: "recovery",
			next: null,
		})
	})

	it.each(["type=email", "token_hash=abc", "token_hash=abc&type=magiclink", "token_hash=&type=email"])(
		"rejects %j",
		(query) => {
			expect(parseConfirmParams(new URLSearchParams(query))).toBeNull()
		}
	)
})
