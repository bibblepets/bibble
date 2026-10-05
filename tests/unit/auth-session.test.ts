import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("server-only", () => ({}))

const getClaims = vi.fn()
vi.mock("@/lib/supabase/server", () => ({ createClient: async () => ({ auth: { getClaims } }) }))

const redirect = vi.fn((url: string) => {
	throw new Error(`NEXT_REDIRECT ${url}`)
})
vi.mock("next/navigation", () => ({ redirect: (url: string) => redirect(url) }))

const { getCurrentUser, requireUser } = await import("@/lib/auth/session")

const claims = { sub: "user-1", email: "alice@bibble.test", user_metadata: { display_name: "Alice" } }

beforeEach(() => {
	getClaims.mockReset()
	redirect.mockClear()
})

describe("getCurrentUser", () => {
	it("returns null when there is no session", async () => {
		getClaims.mockResolvedValue({ data: null, error: null })
		expect(await getCurrentUser()).toBeNull()
	})

	it("maps verified claims to a user", async () => {
		getClaims.mockResolvedValue({ data: { claims } })
		expect(await getCurrentUser()).toEqual({ id: "user-1", email: "alice@bibble.test", displayName: "Alice" })
	})

	it("tolerates missing email and display name", async () => {
		getClaims.mockResolvedValue({ data: { claims: { sub: "user-2", user_metadata: { display_name: "" } } } })
		expect(await getCurrentUser()).toEqual({ id: "user-2", email: "", displayName: null })
	})
})

describe("requireUser", () => {
	it("returns the signed-in user", async () => {
		getClaims.mockResolvedValue({ data: { claims } })
		await expect(requireUser("/seller")).resolves.toMatchObject({ id: "user-1" })
		expect(redirect).not.toHaveBeenCalled()
	})

	it("redirects to log in and back again", async () => {
		getClaims.mockResolvedValue({ data: null, error: null })
		await expect(requireUser("/seller/listings?tab=draft")).rejects.toThrow("NEXT_REDIRECT")
		expect(redirect).toHaveBeenCalledWith("/login?next=%2Fseller%2Flistings%3Ftab%3Ddraft")
	})
})
