import SellerDashboardPage from "@/app/(marketplace)/seller/page"
import SellerProfilePage from "@/app/(marketplace)/seller/profile/page"
import BusinessStepPage from "@/app/(wizard)/seller/onboarding/business/page"
import DocumentsStepPage from "@/app/(wizard)/seller/onboarding/documents/page"
import LocationStepPage from "@/app/(wizard)/seller/onboarding/location/page"
import OnboardingIntroPage from "@/app/(wizard)/seller/onboarding/page"
import ReviewStepPage from "@/app/(wizard)/seller/onboarding/review/page"
import TypeStepPage from "@/app/(wizard)/seller/onboarding/type/page"
import { DocumentUpload } from "@/components/seller/document-upload"
import { WizardFooter } from "@/components/seller/wizard-footer"
import { todayInSingapore } from "@/lib/dates"
import type { CurrentSeller } from "@/lib/sellers/queries"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { makeNewSeller, makeSeller } from "./fixtures/seller"

const state = vi.hoisted(() => ({
	seller: null as CurrentSeller | null,
	feedback: null as { message: string | null } | null,
}))

vi.mock("@/lib/auth/session", () => ({ requireUser: vi.fn() }))
vi.mock("@/lib/sellers/queries", () => ({
	getCurrentSeller: async () => state.seller,
	getSellerFeedback: async () => state.feedback,
	requireSeller: async () => state.seller,
	listSpecies: async () => [
		{ id: 1, slug: "dog", name: "Dogs", isActive: true },
		{ id: 2, slug: "cat", name: "Cats", isActive: false },
	],
	listAreas: async () => [
		{ id: 1, name: "Bedok", region: "east" },
		{ id: 28, name: "Tampines", region: "east" },
		{ id: 40, name: "Woodlands", region: "north" },
	],
}))
vi.mock("@/lib/sellers/wizard", () => ({
	stepPath: (step: string) => `/seller/onboarding/${step}`,
	loadWizardStep: async () => state.seller,
	loadExistingSellerStep: async () => state.seller,
}))

const actions = vi.hoisted(() => ({
	saveTypeStep: vi.fn(),
	saveBusinessStep: vi.fn(),
	saveLocationStep: vi.fn(),
	submitForVerification: vi.fn(),
	updateSellerProfile: vi.fn(),
	recordSellerDocument: vi.fn(),
}))
vi.mock("@/lib/sellers/actions", () => actions)

const listings = vi.hoisted(() => ({ rows: [] as unknown[] }))
vi.mock("@/lib/listings/queries", () => ({ listSellerListings: async () => listings.rows }))
vi.mock("@/lib/listings/actions", () => ({ createListing: vi.fn(async () => ({})) }))

const refresh = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({
	redirect: (path: string) => {
		throw new Error(`NEXT_REDIRECT ${path}`)
	},
	useRouter: () => ({ refresh }),
}))

const upload = vi.hoisted(() => vi.fn())
vi.mock("@/lib/supabase/client", () => ({
	createClient: () => ({ storage: { from: () => ({ upload }) } }),
}))

beforeEach(() => {
	state.seller = null
	state.feedback = null
	vi.clearAllMocks()
	for (const action of Object.values(actions)) action.mockResolvedValue({})
	upload.mockResolvedValue({ data: {}, error: null })
})

describe("Onboarding intro", () => {
	it("invites new sellers to get started", async () => {
		render(await OnboardingIntroPage())
		expect(screen.getByRole("heading", { level: 1, name: "Sell on Bibble" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Get started" })).toHaveAttribute("href", "/seller/onboarding/type")
		expect(screen.getByRole("link", { name: "Exit" })).toHaveAttribute("href", "/")
	})

	it("resumes an incomplete seller where they left off", async () => {
		state.seller = makeNewSeller()
		render(await OnboardingIntroPage())
		expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute("href", "/seller/onboarding/business")
	})

	it("sends submitted sellers to the dashboard", async () => {
		state.seller = makeSeller({ status: "pending" })
		await expect(OnboardingIntroPage()).rejects.toThrow("NEXT_REDIRECT /seller")
	})
})

describe("Type step", () => {
	it("offers both seller types and only active species", async () => {
		render(await TypeStepPage())

		expect(screen.getByRole("radio", { name: /Pet shop/ })).not.toBeChecked()
		expect(screen.getByRole("radio", { name: /Breeder/ })).toBeInTheDocument()
		expect(screen.getByRole("checkbox", { name: "Dogs" })).toBeChecked()
		expect(screen.getByRole("checkbox", { name: /Cats/ })).toBeDisabled()
		expect(screen.getByRole("progressbar", { name: "Step 1 of 5" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Save & exit" })).toHaveAttribute("form", "wizard-step")
	})

	it("preselects an existing seller's choices", async () => {
		state.seller = makeNewSeller({ sellerType: "breeder", species: [] })
		render(await TypeStepPage())
		expect(screen.getByRole("radio", { name: /Breeder/ })).toBeChecked()
		expect(screen.getByRole("checkbox", { name: "Dogs" })).not.toBeChecked()
	})

	it("shows errors from the action", async () => {
		actions.saveTypeStep.mockResolvedValue({
			fieldErrors: { sellerType: "Choose the kind of business you run.", species: "Choose at least one." },
			formError: "Something went wrong.",
		})
		const user = userEvent.setup()
		render(await TypeStepPage())

		await user.click(screen.getByRole("button", { name: "Next" }))

		expect(await screen.findByText("Choose the kind of business you run.")).toBeInTheDocument()
		expect(screen.getByText("Choose at least one.")).toBeInTheDocument()
		expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong.")
	})
})

describe("Business step", () => {
	it("asks for the licence that matches the seller type", async () => {
		state.seller = makeNewSeller({ sellerType: "breeder" })
		render(await BusinessStepPage())

		expect(screen.getByLabelText("AVS breeder licence number")).toHaveAccessibleDescription("For example BR25008.")
		expect(screen.getByLabelText("UEN")).toHaveValue("")
	})

	it("prefills saved details and shows returned errors", async () => {
		state.seller = makeSeller()
		actions.saveBusinessStep.mockResolvedValue({ fieldErrors: { uen: "Enter a valid UEN." }, values: { uen: "123" } })
		const user = userEvent.setup()
		render(await BusinessStepPage())

		expect(screen.getByLabelText("Trading name")).toHaveValue("Happy Paws")
		await user.click(screen.getByRole("button", { name: "Next" }))

		expect(await screen.findByText("Enter a valid UEN.")).toBeInTheDocument()
		expect(screen.getByLabelText("UEN")).toHaveValue("123")
		expect(screen.getByLabelText("Trading name")).toHaveValue("Happy Paws")
	})
})

describe("Location step", () => {
	it("previews the public location as the area changes", async () => {
		state.seller = makeNewSeller({ contactEmail: "new@bibble.test" })
		const user = userEvent.setup()
		render(await LocationStepPage())

		expect(screen.getByText("Choose an area to see what buyers will see.")).toBeInTheDocument()
		expect(screen.getByLabelText("Email")).toHaveValue("new@bibble.test")

		await user.selectOptions(screen.getByLabelText("Area"), "Woodlands")
		expect(screen.getByText("Woodlands, North")).toBeInTheDocument()
		expect(
			within(screen.getByLabelText("Area"))
				.getAllByRole("group")
				.map((g) => g.getAttribute("label"))
		).toEqual(["East", "North"])
	})

	it("shows saved details without the +65 prefix", async () => {
		state.seller = makeSeller()
		render(await LocationStepPage())
		expect(screen.getByLabelText("Phone")).toHaveValue("67891234")
		expect(screen.getByText("Tampines, East")).toBeInTheDocument()
	})

	it("shows returned errors", async () => {
		state.seller = makeSeller()
		actions.saveLocationStep.mockResolvedValue({ fieldErrors: { postalCode: "Enter a 6-digit postal code." } })
		const user = userEvent.setup()
		render(await LocationStepPage())

		await user.click(screen.getByRole("button", { name: "Next" }))
		expect(await screen.findByText("Enter a 6-digit postal code.")).toBeInTheDocument()
	})
})

describe("Documents step", () => {
	it("blocks Next until both documents are uploaded", async () => {
		state.seller = makeNewSeller()
		render(await DocumentsStepPage())

		expect(screen.getByRole("region", { name: "AVS licence" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
		expect(screen.getByRole("link", { name: "Exit" })).toHaveAttribute("href", "/seller")
	})

	it("continues to review once both are uploaded", async () => {
		state.seller = makeSeller()
		render(await DocumentsStepPage())

		expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/seller/onboarding/review")
		expect(screen.getAllByText("Replace file")).toHaveLength(2)
	})
})

describe("DocumentUpload", () => {
	const sellerId = "seller-1"
	const pdf = () => new File(["%PDF"], "licence.pdf", { type: "application/pdf" })

	it("uploads into the seller's folder, records it and refreshes", async () => {
		const user = userEvent.setup()
		render(<DocumentUpload sellerId={sellerId} kind="avs_licence" />)

		await user.upload(screen.getByLabelText("Upload file"), pdf())

		expect(upload).toHaveBeenCalledWith(expect.stringMatching(/^seller-1\/[\w-]+\.pdf$/), expect.any(File), {
			contentType: "application/pdf",
			upsert: false,
		})
		expect(actions.recordSellerDocument).toHaveBeenCalledWith({
			kind: "avs_licence",
			storagePath: upload.mock.calls[0][0],
			fileName: "licence.pdf",
		})
		expect(refresh).toHaveBeenCalled()
	})

	it("rejects unsupported files before uploading", async () => {
		const user = userEvent.setup({ applyAccept: false })
		render(<DocumentUpload sellerId={sellerId} kind="avs_licence" />)

		await user.upload(screen.getByLabelText("Upload file"), new File(["x"], "notes.txt", { type: "text/plain" }))

		expect(screen.getByRole("alert")).toHaveTextContent("Upload a PDF, JPG or PNG.")
		expect(upload).not.toHaveBeenCalled()
	})

	it("reports upload failures", async () => {
		upload.mockResolvedValue({ data: null, error: { message: "network" } })
		const user = userEvent.setup()
		render(<DocumentUpload sellerId={sellerId} kind="acra_bizfile" />)

		await user.upload(screen.getByLabelText("Upload file"), pdf())

		expect(await screen.findByRole("alert")).toHaveTextContent(/Upload failed/)
		expect(actions.recordSellerDocument).not.toHaveBeenCalled()
	})

	it("reports errors recording the upload", async () => {
		actions.recordSellerDocument.mockResolvedValue({ error: "We couldn't find your upload." })
		const user = userEvent.setup()
		render(<DocumentUpload sellerId={sellerId} kind="avs_licence" />)

		await user.upload(screen.getByLabelText("Upload file"), pdf())

		expect(await screen.findByRole("alert")).toHaveTextContent("We couldn't find your upload.")
		expect(refresh).not.toHaveBeenCalled()
	})

	it("ignores an empty selection", async () => {
		render(<DocumentUpload sellerId={sellerId} kind="avs_licence" />)
		const input = screen.getByLabelText("Upload file")
		input.dispatchEvent(new Event("change", { bubbles: true }))
		expect(upload).not.toHaveBeenCalled()
	})

	it("shows the current file", () => {
		render(
			<DocumentUpload
				sellerId={sellerId}
				kind="avs_licence"
				current={{ id: "d1", kind: "avs_licence", fileName: "licence.pdf", sizeBytes: 2048, createdAt: "" }}
			/>
		)
		expect(screen.getByText("licence.pdf")).toBeInTheDocument()
		expect(screen.getByLabelText("Uploaded")).toBeInTheDocument()
		expect(screen.getByLabelText("Replace file")).toBeInTheDocument()
	})
})

describe("Review step", () => {
	it("summarises everything with edit links", async () => {
		state.seller = makeSeller()
		render(await ReviewStepPage())

		const main = screen.getByRole("main")
		expect(main).toHaveTextContent("AS24A00123")
		expect(main).toHaveTextContent("Tampines, East")
		expect(main).toHaveTextContent("+65 6789 1234")
		expect(main).toHaveTextContent("1 Oct 2027")
		expect(main).toHaveTextContent("bizfile.pdf (3.3 MB)")
		expect(screen.getByRole("link", { name: "Edit business details" })).toHaveAttribute(
			"href",
			"/seller/onboarding/business"
		)
	})

	it("explains a rejection and shows submit errors", async () => {
		state.seller = makeSeller({ status: "rejected", about: null, addressLine1: null })
		state.feedback = { message: "Licence not in the AVS registry." }
		actions.submitForVerification.mockResolvedValue({
			formError: "Upload both your AVS licence and your ACRA BizFile.",
		})
		const user = userEvent.setup()
		render(await ReviewStepPage())

		expect(screen.getByText(/couldn't verify your previous submission/)).toBeInTheDocument()
		expect(screen.getByRole("main")).toHaveTextContent("Reason: Licence not in the AVS registry.")
		expect(screen.getAllByText("Not provided").length).toBeGreaterThan(0)
		await user.click(screen.getByRole("button", { name: "Submit for verification" }))
		expect(await screen.findByRole("alert")).toHaveTextContent("Upload both")
	})
})

describe("Seller dashboard", () => {
	it("guides incomplete sellers through the checklist", async () => {
		state.seller = makeNewSeller({ displayName: null })
		render(await SellerDashboardPage())

		expect(screen.getByRole("heading", { level: 1, name: "Your business" })).toBeInTheDocument()
		expect(screen.getByRole("status", { name: "Verification status" })).toHaveTextContent("Finish setting up")
		expect(screen.getByRole("link", { name: "Choose your business type (done)" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Add your business details (to do)" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Continue setup" })).toHaveAttribute("href", "/seller/onboarding/business")
		expect(screen.queryByRole("link", { name: "Edit details" })).toBeNull()
	})

	it("asks rejected sellers to resubmit, with the reason", async () => {
		state.seller = makeSeller({ status: "rejected" })
		state.feedback = { message: "Licence not in the AVS registry." }
		render(await SellerDashboardPage())
		expect(screen.getByRole("status", { name: "Verification status" })).toHaveTextContent(
			"Reason: Licence not in the AVS registry."
		)
		expect(screen.getByRole("link", { name: "Review and resubmit" })).toHaveAttribute(
			"href",
			"/seller/onboarding/review"
		)
	})

	it("shows suspended sellers why", async () => {
		state.seller = makeSeller({ status: "suspended" })
		state.feedback = { message: "Complaint under review." }
		render(await SellerDashboardPage())
		expect(screen.getByRole("status", { name: "Verification status" })).toHaveTextContent(
			"Reason: Complaint under review."
		)
	})

	it("shows verified sellers their details", async () => {
		state.seller = makeSeller({ status: "verified", licenceExpiresOn: "2099-01-01" })
		render(await SellerDashboardPage())

		expect(screen.getByRole("status", { name: "Verification status" })).toHaveTextContent("You're verified")
		expect(screen.getByRole("link", { name: "Edit details" })).toHaveAttribute("href", "/seller/profile")
		expect(screen.queryByText(/licence expires in/)).toBeNull()
	})

	it.each([
		[10, "Your AVS licence expires in 10 days"],
		[-1, "Your AVS licence has expired"],
	])("warns about a licence expiring in %i days", async (days, message) => {
		const expiry = new Date(Date.parse(todayInSingapore()) + days * 86_400_000).toISOString().slice(0, 10)
		state.seller = makeSeller({ status: "verified", licenceExpiresOn: expiry })
		render(await SellerDashboardPage())
		expect(screen.getByRole("alert")).toHaveTextContent(message)
	})
})

describe("Seller profile", () => {
	it("sends sellers who haven't submitted to the wizard", async () => {
		state.seller = makeNewSeller()
		await expect(SellerProfilePage()).rejects.toThrow("NEXT_REDIRECT /seller/onboarding")
	})

	it("shows locked details read-only and the rest as a form", async () => {
		state.seller = makeSeller({ status: "verified" })
		actions.updateSellerProfile.mockResolvedValue({
			formError: "Something went wrong.",
			fieldErrors: { about: "Too long." },
		})
		const user = userEvent.setup()
		render(await SellerProfilePage())

		const locked = screen.getByRole("region", { name: "Verified details" })
		expect(locked).toHaveTextContent("53123456A")
		expect(locked).toHaveTextContent("Dogs")
		expect(screen.queryByLabelText("UEN")).toBeNull()
		expect(screen.getByLabelText("Licence expiry date")).toHaveValue("2027-10-01")

		await user.click(screen.getByRole("button", { name: "Save changes" }))
		expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong.")
		expect(screen.getByLabelText("About your business (optional)")).toHaveAccessibleDescription("Too long.")
	})
})

describe("WizardFooter", () => {
	it("goes back to the intro from the first step and to the previous step after that", () => {
		const { rerender } = render(<WizardFooter step="type" next={{ kind: "link", href: "/x" }} />)
		expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute("href", "/seller/onboarding")
		expect(screen.getByRole("link", { name: "Next" })).toHaveAttribute("href", "/x")

		rerender(<WizardFooter step="location" next={{ kind: "submit", formId: "f", pending: true }} />)
		expect(screen.getByRole("link", { name: "Back" })).toHaveAttribute("href", "/seller/onboarding/business")
		expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
	})
})
