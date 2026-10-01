import AdminLayout from "@/app/(admin)/admin/layout"
import AdminHomePage from "@/app/(admin)/admin/page"
import AdminSellerPage from "@/app/(admin)/admin/sellers/[id]/page"
import AdminSellersPage from "@/app/(admin)/admin/sellers/page"
import { checklistKeys } from "@/lib/admin/checklist"
import type { SellerForReview, SellerQueueRow } from "@/lib/admin/queries"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeSeller } from "./fixtures/seller"

const state = vi.hoisted(() => ({
	admin: true,
	review: null as SellerForReview | null,
	rows: [] as SellerQueueRow[],
	requested: [] as string[],
}))

vi.mock("@/lib/admin/session", () => ({
	isPlatformAdmin: async () => state.admin,
	requireAdmin: async () => {
		if (!state.admin) throw new Error("NEXT_NOT_FOUND")
	},
}))
vi.mock("@/lib/admin/queries", () => ({
	countSellersByStatus: async () => ({ pending: 2, verified: 5, rejected: 0, suspended: 1, incomplete: 3 }),
	listSellersForReview: async (status: string) => {
		state.requested.push(status)
		return state.rows
	},
	getSellerForReview: async () => state.review,
}))
vi.mock("@/lib/sellers/queries", () => ({
	listSpecies: async () => [
		{ id: 1, slug: "dog", name: "Dogs", isActive: true },
		{ id: 2, slug: "cat", name: "Cats", isActive: false },
	],
}))
vi.mock("@/components/layout/user-menu-slot", () => ({ UserMenuSlot: () => <div>user menu</div> }))

const actions = vi.hoisted(() => ({ reviewSeller: vi.fn(), correctSellerDetails: vi.fn() }))
vi.mock("@/lib/admin/actions", () => actions)

vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Error(`NEXT_REDIRECT ${path}`)
	},
	notFound: () => {
		throw new Error("NEXT_NOT_FOUND")
	},
}))

const sellerId = "aaaaaaaa-0000-0000-0000-000000000003"
const params = (id = sellerId) => ({ params: Promise.resolve({ id }), searchParams: Promise.resolve({}) })

function review(
	overrides: Partial<SellerForReview["seller"]> = {},
	history: SellerForReview["history"] = []
): SellerForReview {
	return {
		seller: makeSeller({ id: sellerId, status: "pending", ...overrides }),
		owner: { email: "eve@bibble.test", displayName: "Eve" },
		history,
	}
}

beforeEach(() => {
	state.admin = true
	state.review = null
	state.rows = []
	state.requested = []
	vi.clearAllMocks()
	for (const action of Object.values(actions)) action.mockResolvedValue({})
})

describe("AdminLayout", () => {
	it("shows the console chrome to admins", async () => {
		render(await AdminLayout({ children: <p>Body</p>, params: Promise.resolve({}) }))
		expect(screen.getByText("Admin")).toBeInTheDocument()
		expect(screen.getByRole("navigation", { name: "Admin" })).toHaveTextContent("Sellers")
		expect(screen.getByText("Body")).toBeInTheDocument()
	})

	it("shows nothing admin-related to anyone else", async () => {
		state.admin = false
		render(await AdminLayout({ children: <p>Body</p>, params: Promise.resolve({}) }))
		expect(screen.queryByText("Admin")).toBeNull()
		expect(screen.getByText("Body")).toBeInTheDocument()
	})
})

describe("Admin home", () => {
	it("redirects to the seller queue", () => {
		expect(() => AdminHomePage()).toThrow("NEXT_REDIRECT /admin/sellers")
	})
})

describe("Seller queue", () => {
	const row: SellerQueueRow = {
		id: sellerId,
		displayName: "Furry Friends",
		sellerType: "pet_shop",
		uen: "202455555E",
		licenceNo: "AS25C01234",
		area: { name: "Bedok", region: "east" },
		submittedAt: new Date(Date.now() - 2 * 86_400_000).toISOString(),
		updatedAt: new Date().toISOString(),
	}

	it("defaults to the pending queue with counts and waiting times", async () => {
		state.rows = [row]
		render(await AdminSellersPage({ params: Promise.resolve({}), searchParams: Promise.resolve({}) }))

		expect(state.requested).toEqual(["pending"])
		const tabs = screen.getByRole("navigation", { name: "Seller status" })
		expect(within(tabs).getByRole("link", { name: "Pending, 2 sellers" })).toHaveAttribute("aria-current", "page")
		expect(within(tabs).getByRole("link", { name: "Suspended, 1 seller" })).toHaveAttribute(
			"href",
			"/admin/sellers?status=suspended"
		)
		expect(screen.getByRole("link", { name: "Furry Friends" })).toHaveAttribute("href", `/admin/sellers/${sellerId}`)
		expect(screen.getByRole("columnheader", { name: "Waiting" })).toBeInTheDocument()
		expect(screen.getByRole("row", { name: /Furry Friends/ })).toHaveTextContent("2 days")
	})

	it("shows other statuses by recent update, and ignores unknown ones", async () => {
		state.rows = [{ ...row, displayName: null, uen: null, licenceNo: null, area: null }]
		render(
			await AdminSellersPage({ params: Promise.resolve({}), searchParams: Promise.resolve({ status: "verified" }) })
		)
		expect(state.requested).toEqual(["verified"])
		expect(screen.getByRole("columnheader", { name: "Updated" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Unnamed seller" })).toBeInTheDocument()
		expect(screen.getByRole("row", { name: /Unnamed seller/ })).toHaveTextContent("a few minutes ago")

		await AdminSellersPage({ params: Promise.resolve({}), searchParams: Promise.resolve({ status: "nope" }) })
		expect(state.requested).toEqual(["verified", "pending"])
	})

	it("says when a tab is empty", async () => {
		render(await AdminSellersPage({ params: Promise.resolve({}), searchParams: Promise.resolve({}) }))
		expect(screen.getByText("No sellers here.")).toBeInTheDocument()
	})
})

describe("Seller review page", () => {
	it("404s for malformed and unknown ids", async () => {
		await expect(AdminSellerPage(params("not-a-uuid"))).rejects.toThrow("NEXT_NOT_FOUND")
		await expect(AdminSellerPage(params())).rejects.toThrow("NEXT_NOT_FOUND")
	})

	it("shows the seller, sources and linked documents", async () => {
		state.review = review()
		render(await AdminSellerPage(params()))

		expect(screen.getByRole("heading", { level: 1, name: "Happy Paws" })).toBeInTheDocument()
		expect(screen.getByText("Owner: Eve · eve@bibble.test")).toBeInTheDocument()
		const sources = screen.getByRole("region", { name: "Verification sources" })
		expect(within(sources).getByRole("link", { name: /registry of licensed pet shops/ })).toHaveAttribute(
			"href",
			expect.stringContaining("pet-shops")
		)
		expect(screen.getByRole("link", { name: /licence\.pdf/ })).toHaveAttribute("href", "/admin/documents/d1")
		expect(screen.getByText("No decisions yet.")).toBeInTheDocument()
	})

	it("enables Approve only once every check is ticked", async () => {
		state.review = review()
		const user = userEvent.setup()
		render(await AdminSellerPage(params()))
		const panel = screen.getByRole("region", { name: "Decision" })
		const approve = within(panel).getByRole("button", { name: "Approve" })

		expect(approve).toBeDisabled()
		const boxes = within(panel).getAllByRole("checkbox")
		expect(boxes).toHaveLength(checklistKeys.length)
		for (const box of boxes) await user.click(box)
		expect(approve).toBeEnabled()
		await user.click(boxes[0])
		expect(approve).toBeDisabled()
		await user.click(boxes[0])

		await user.click(approve)
		const formData = actions.reviewSeller.mock.calls[0][2] as FormData
		expect(actions.reviewSeller.mock.calls[0][0]).toBe(sellerId)
		expect(formData.get("decision")).toBe("approved")
		expect(formData.getAll("checklist").toSorted()).toEqual([...checklistKeys].toSorted())
	})

	it("shows decision errors", async () => {
		state.review = review()
		actions.reviewSeller.mockResolvedValue({
			formError: "Status changed.",
			fieldErrors: { message: "Tell the seller why.", checklist: "Tick every check." },
		})
		const user = userEvent.setup()
		render(await AdminSellerPage(params()))

		await user.click(screen.getByRole("button", { name: "Reject" }))

		expect(await screen.findByText("Status changed.")).toBeInTheDocument()
		expect(screen.getByLabelText("Message to the seller")).toHaveAccessibleDescription("Tell the seller why.")
		expect(screen.getByText("Tick every check.")).toBeInTheDocument()
	})

	it.each([
		["verified", "Suspend seller", "Message to the seller"],
		["suspended", "Reinstate seller", "Message to the seller (optional)"],
	] as const)("offers the right decision for a %s seller", async (status, button, label) => {
		state.review = review({ status })
		render(await AdminSellerPage(params()))
		expect(screen.getByRole("button", { name: button })).toBeInTheDocument()
		expect(screen.getByLabelText(label)).toBeInTheDocument()
		expect(screen.queryByRole("button", { name: "Approve" })).toBeNull()
	})

	it.each([
		["incomplete", /still filling in/],
		["rejected", /Waiting for the seller to fix/],
	] as const)("waits on a %s seller", async (status, text) => {
		state.review = review({ status })
		render(await AdminSellerPage(params()))
		expect(screen.getByRole("region", { name: "Decision" })).toHaveTextContent(text)
	})

	it("lists the review history", async () => {
		state.review = review({ status: "verified", displayName: null }, [
			{
				id: "r1",
				decision: "approved",
				message: null,
				internalNote: "Registry checked",
				checklist: [...checklistKeys],
				reviewerName: "Carol",
				createdAt: "2026-10-01T17:15:00Z",
			},
			{
				id: "r0",
				decision: "rejected",
				message: "Wrong UEN",
				internalNote: null,
				checklist: [],
				reviewerName: null,
				createdAt: "2026-09-30T01:00:00Z",
			},
		])
		state.review.owner = { email: "eve@bibble.test", displayName: null }
		render(await AdminSellerPage(params()))

		expect(screen.getByRole("heading", { level: 1, name: "Unnamed seller" })).toBeInTheDocument()
		expect(screen.getByText("Owner: eve@bibble.test")).toBeInTheDocument()
		const history = screen.getByRole("region", { name: "History" })
		expect(history).toHaveTextContent("Approved by Carol")
		expect(history).toHaveTextContent("Internal: Registry checked")
		expect(history).toHaveTextContent("All 6 checks ticked")
		expect(history).toHaveTextContent("Rejected by a former admin")
		expect(history).toHaveTextContent("To seller: Wrong UEN")
	})

	it("submits corrections with the seller's current details", async () => {
		state.review = review({ status: "verified" })
		state.review.owner = null
		actions.correctSellerDetails.mockResolvedValue({
			formError: "Another seller already uses this UEN.",
			fieldErrors: { species: "Choose at least one species." },
			values: { uen: "202400000Z" },
		})
		const user = userEvent.setup()
		render(await AdminSellerPage(params()))

		expect(screen.getByLabelText("Seller type")).toHaveValue("pet_shop")
		expect(screen.getByRole("checkbox", { name: "Dogs" })).toBeChecked()
		expect(screen.queryByRole("checkbox", { name: "Cats" })).toBeNull()

		await user.clear(screen.getByLabelText("UEN"))
		await user.type(screen.getByLabelText("UEN"), "202400000Z")
		await user.type(screen.getByLabelText("Reason for the correction"), "Re-registered")
		await user.click(screen.getByRole("button", { name: "Save correction" }))

		const formData = actions.correctSellerDetails.mock.calls[0][2] as FormData
		expect(formData.get("internalNote")).toBe("Re-registered")
		expect(formData.getAll("species")).toEqual(["dog"])
		expect(await screen.findByText("Another seller already uses this UEN.")).toBeInTheDocument()
		expect(screen.getByText("Choose at least one species.")).toBeInTheDocument()
		expect(screen.getByLabelText("UEN")).toHaveValue("202400000Z")
	})
})
