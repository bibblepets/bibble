import { forgotPasswordSchema, logInSchema, resetPasswordSchema, signUpSchema } from "@/lib/auth/schema"
import { describe, expect, it } from "vitest"

const valid = { displayName: "Alice Tan", email: "alice@bibble.test", password: "password123" }

function firstError(result: { success: boolean; error?: { issues: { message: string }[] } }) {
	return result.error?.issues[0]?.message
}

describe("signUpSchema", () => {
	it("trims the name and normalises the email", () => {
		const result = signUpSchema.parse({ ...valid, displayName: "  Alice Tan ", email: " Alice@Bibble.TEST " })
		expect(result).toEqual(valid)
	})

	it.each([
		[{ displayName: "   " }, "Enter your name."],
		[{ displayName: "a".repeat(81) }, "Use 80 characters or fewer."],
		[{ email: "not-an-email" }, "Enter a valid email address."],
		[{ password: "short1" }, "Use at least 8 characters."],
		[{ password: "a".repeat(70) + "123" }, "Use 72 characters or fewer."],
		[{ password: "12345678" }, "Include at least one letter."],
		[{ password: "abcdefgh" }, "Include at least one number."],
	])("rejects %j", (override, message) => {
		expect(firstError(signUpSchema.safeParse({ ...valid, ...override }))).toBe(message)
	})
})

describe("logInSchema", () => {
	it("accepts any non-empty password", () => {
		expect(logInSchema.safeParse({ email: "a@b.test", password: "x" }).success).toBe(true)
	})

	it("requires a password", () => {
		expect(firstError(logInSchema.safeParse({ email: "a@b.test", password: "" }))).toBe("Enter your password.")
	})
})

describe("forgotPasswordSchema", () => {
	it("requires a valid email", () => {
		expect(forgotPasswordSchema.safeParse({ email: "nope" }).success).toBe(false)
	})
})

describe("resetPasswordSchema", () => {
	it("accepts matching strong passwords", () => {
		expect(resetPasswordSchema.safeParse({ password: "newpass123", confirmPassword: "newpass123" }).success).toBe(true)
	})

	it("flags a mismatch on the confirmation field", () => {
		const result = resetPasswordSchema.safeParse({ password: "newpass123", confirmPassword: "newpass124" })
		expect(result.error?.issues[0]).toMatchObject({ path: ["confirmPassword"], message: "Passwords don't match." })
	})
})
