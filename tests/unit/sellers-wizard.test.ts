import type { CurrentSeller } from "@/lib/sellers/queries"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeNewSeller, makeSeller } from "./fixtures/seller"

vi.mock("server-only", () => ({}))
const state = vi.hoisted(() => ({ seller: null as CurrentSeller | null }))
const requireUser = vi.hoisted(() => vi.fn())
vi.mock("@/lib/auth/session", () => ({ requireUser }))
vi.mock("@/lib/sellers/queries", () => ({ getCurrentSeller: async () => state.seller }))
vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Error(`NEXT_REDIRECT ${path}`)
	},
}))

const { loadExistingSellerStep, loadWizardStep, stepPath } = await import("@/lib/sellers/wizard")

beforeEach(() => {
	state.seller = null
	requireUser.mockClear()
})

describe("wizard guards", () => {
	it("builds step paths", () => {
		expect(stepPath("documents")).toBe("/seller/onboarding/documents")
	})

	it("requires logging in, returning to the step", async () => {
		await loadWizardStep("type")
		expect(requireUser).toHaveBeenCalledWith("/seller/onboarding/type")
	})

	it("lets new users start at the type step", async () => {
		expect(await loadWizardStep("type")).toBeNull()
	})

	it("sends users without a seller back to the type step", async () => {
		await expect(loadExistingSellerStep("business")).rejects.toThrow("NEXT_REDIRECT /seller/onboarding/type")
	})

	it("sends sellers who skip ahead to their first unfinished step", async () => {
		state.seller = makeNewSeller()
		await expect(loadWizardStep("review")).rejects.toThrow("NEXT_REDIRECT /seller/onboarding/business")
	})

	it("returns the seller for a step they can open", async () => {
		state.seller = makeSeller()
		await expect(loadExistingSellerStep("review")).resolves.toBe(state.seller)
	})

	it.each(["pending", "verified", "suspended"] as const)("sends %s sellers to the dashboard", async (status) => {
		state.seller = makeSeller({ status })
		await expect(loadWizardStep("type")).rejects.toThrow("NEXT_REDIRECT /seller")
	})

	it("lets rejected sellers back in", async () => {
		state.seller = makeSeller({ status: "rejected" })
		await expect(loadWizardStep("business")).resolves.toBe(state.seller)
	})
})
