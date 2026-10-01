import { safeRedirectPath, safeRedirectUrl } from "@/lib/redirect"
import { describe, expect, it } from "vitest"

const origin = "http://localhost:3000"

describe("safeRedirectUrl", () => {
	it.each([
		["/pets", "http://localhost:3000/pets"],
		["/pets?type=dog#top", "http://localhost:3000/pets?type=dog#top"],
		["pets", "http://localhost:3000/pets"],
		["http://localhost:3000/account", "http://localhost:3000/account"],
	])("allows same-origin target %j", (next, expected) => {
		expect(safeRedirectUrl(next, origin).href).toBe(expected)
	})

	it.each([
		"//evil.com",
		"/\\evil.com",
		"\\\\evil.com",
		"/\t/evil.com",
		"/\n/evil.com",
		"https://evil.com",
		"http://localhost:3000.evil.com",
		"https://localhost:3000/pets",
		"javascript:alert(1)",
		"http://[::1",
	])("rejects off-origin or invalid target %j", (next) => {
		expect(safeRedirectUrl(next, origin).href).toBe("http://localhost:3000/")
	})

	it("falls back when next is missing", () => {
		expect(safeRedirectUrl(null, origin).href).toBe("http://localhost:3000/")
		expect(safeRedirectUrl("", origin).href).toBe("http://localhost:3000/")
	})

	it("uses a custom fallback", () => {
		expect(safeRedirectUrl("//evil.com", origin, "/home").href).toBe("http://localhost:3000/home")
	})
})

describe("safeRedirectPath", () => {
	it.each([
		["/seller/listings", "/seller/listings"],
		["/reset-password?step=2#form", "/reset-password?step=2#form"],
	])("keeps relative target %j", (next, expected) => {
		expect(safeRedirectPath(next)).toBe(expected)
	})

	it.each([null, "", "//evil.com", "/\\evil.com", "https://evil.com/x", "http://localhost:3000/account"])(
		"falls back for %j",
		(next) => {
			expect(safeRedirectPath(next)).toBe("/")
			expect(safeRedirectPath(next, "/login")).toBe("/login")
		}
	)
})
