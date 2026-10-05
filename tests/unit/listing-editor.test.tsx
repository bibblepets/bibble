import ListingEditorPage from "@/app/(marketplace)/seller/listings/[id]/page"
import SellerListingsPage from "@/app/(marketplace)/seller/listings/page"
import { ListingActions } from "@/components/listings/editor/listing-actions"
import { ListingsSummary } from "@/components/listings/listings-summary"
import type { ListingForEdit, SellerListingRow } from "@/lib/listings/queries"
import type { ListingIssue } from "@/lib/listings/rules"
import type { CurrentSeller } from "@/lib/sellers/queries"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LISTING_ID, makeListing } from "./fixtures/listing"
import { makeSeller } from "./fixtures/seller"

const state = vi.hoisted(() => ({
	seller: null as unknown as CurrentSeller,
	listing: null as unknown as ListingForEdit,
	rows: [] as SellerListingRow[],
}))

vi.mock("@/lib/sellers/queries", () => ({ requireSeller: async () => state.seller }))
vi.mock("@/lib/listings/session", () => ({
	requireOwnListing: async () => ({ seller: state.seller, listing: state.listing }),
}))
vi.mock("@/lib/listings/queries", () => ({
	listSellerListings: async () => state.rows,
	listBreeds: async () => [
		{ id: 4, name: "Akita", specifiedPart: 1 },
		{ id: 13, name: "Beagle", specifiedPart: null },
		{ id: 79, name: "Rottweiler", specifiedPart: 2 },
	],
}))

const actions = vi.hoisted(() => ({
	createListing: vi.fn(),
	saveAnimal: vi.fn(),
	saveListingInfo: vi.fn(),
	saveMicrochip: vi.fn(),
	addHealthRecord: vi.fn(),
	removeHealthRecord: vi.fn(),
	saveSource: vi.fn(),
	recordListingDocument: vi.fn(),
	changeListingStatus: vi.fn(),
	deleteDraft: vi.fn(),
}))
vi.mock("@/lib/listings/actions", () => actions)
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }))
vi.mock("next/image", () => import("./mocks/next-image"))
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ storage: { from: () => ({ upload: vi.fn() }) } }) }))

const params = { params: Promise.resolve({ id: LISTING_ID }), searchParams: Promise.resolve({}) }

/** A listing that passes every rule, for a verified pet shop. */
function completeListing(overrides: Partial<ListingForEdit> = {}) {
	return makeListing({
		title: "Sweet Beagle boy",
		priceCents: 320000,
		breed: { id: 13, name: "Beagle", specifiedPart: null },
		sex: "male",
		dateOfBirth: "2026-07-01",
		readyDate: "2026-09-30",
		colour: "Tricolour",
		weightKg: 4.5,
		microchipNo: "900085000000001",
		source: "licensed_breeder",
		sourceLicenceNo: "BR25001",
		healthRecords: [
			{ id: "h1", kind: "deworming", givenOn: "2026-07-20", product: "Drontal", clinic: null },
			{ id: "h2", kind: "deworming", givenOn: "2026-08-03", product: "Drontal", clinic: "Vet" },
			{ id: "h3", kind: "vaccination", givenOn: "2026-08-20", product: "DHP", clinic: null },
			{ id: "h4", kind: "vaccination", givenOn: "2026-09-10", product: "DHPPi", clinic: null },
		],
		documents: {
			vaccination_card: { id: "d1", kind: "vaccination_card", fileName: "card.pdf", sizeBytes: 100, createdAt: "" },
		},
		documentKinds: ["vaccination_card"],
		images: [{ id: "i1", url: "https://cdn.test/l/1.webp", position: 0, width: 1600, height: 1200 }],
		imageCount: 1,
		...overrides,
	})
}

beforeEach(() => {
	vi.clearAllMocks()
	state.seller = makeSeller({ status: "verified", licenceExpiresOn: "2099-01-01" })
	state.listing = makeListing()
	state.rows = []
	for (const action of Object.values(actions)) action.mockResolvedValue({})
})

describe("Listings page", () => {
	const row = (overrides: Partial<SellerListingRow>): SellerListingRow => ({
		id: "l1",
		title: "Sweet Beagle boy",
		status: "published",
		priceCents: 320000,
		breedName: "Beagle",
		crossBreedName: null,
		dateOfBirth: "2026-07-01",
		updatedAt: "2026-10-05",
		coverUrl: null,
		...overrides,
	})

	it("shows an empty state", async () => {
		render(await SellerListingsPage(params as never))
		expect(screen.getByText(/No listings yet/)).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Create listing" })).toBeInTheDocument()
	})

	it("lists listings with filters and counts", async () => {
		state.rows = [
			row({}),
			row({ id: "l2", title: null, status: "draft", priceCents: null, breedName: null, dateOfBirth: null }),
			row({ id: "l3", title: "Cavapoo", breedName: "Cavalier", crossBreedName: "Poodle", status: "pending_review" }),
		]
		render(await SellerListingsPage(params as never))

		const filters = screen.getByRole("navigation", { name: "Listing filters" })
		expect(within(filters).getByRole("link", { name: "All, 3" })).toHaveAttribute("aria-current", "page")
		expect(within(filters).getByRole("link", { name: "Drafts, 1" })).toHaveAttribute(
			"href",
			"/seller/listings?show=drafts"
		)
		const list = screen.getByRole("list", { name: "Listings" })
		expect(within(list).getByRole("link", { name: /Sweet Beagle boy/ })).toHaveAttribute("href", "/seller/listings/l1")
		expect(list).toHaveTextContent("Untitled draft")
		expect(list).toHaveTextContent("Details not added yet")
		expect(list).toHaveTextContent("Cavalier × Poodle")
		expect(list).toHaveTextContent("$3,200")
		expect(list).toHaveTextContent("In review")
	})

	it("filters by status", async () => {
		state.rows = [row({}), row({ id: "l2", status: "sold", title: "Sold pup" })]
		render(await SellerListingsPage({ ...params, searchParams: Promise.resolve({ show: "sold" }) } as never))
		const list = screen.getByRole("list", { name: "Listings" })
		expect(list).toHaveTextContent("Sold pup")
		expect(list).not.toHaveTextContent("Sweet Beagle boy")
	})

	it("says when a filter is empty", async () => {
		state.rows = [row({})]
		render(await SellerListingsPage({ ...params, searchParams: Promise.resolve({ show: "drafts" }) } as never))
		expect(screen.getByText("No listings here.")).toBeInTheDocument()
	})
})

describe("Listing editor", () => {
	it("shows what's missing on a new draft and links each item to its section", async () => {
		render(await ListingEditorPage(params as never))

		expect(screen.getByRole("heading", { level: 1, name: "New listing" })).toBeInTheDocument()
		const checklist = screen.getByRole("list", { name: "Before you can submit" })
		expect(within(checklist).getByRole("link", { name: /microchip/ })).toHaveAttribute("href", "#health")
		expect(screen.getByRole("button", { name: "Submit for review" })).toBeDisabled()
		expect(screen.getAllByLabelText("Incomplete")).toHaveLength(6)
		expect(within(checklist).getByRole("link", { name: "Add at least one photo." })).toHaveAttribute("href", "#photos")
		expect(screen.getByRole("button", { name: "Delete draft" })).toBeInTheDocument()
	})

	it("marks Part 1 breeds unavailable and labels Part 2", async () => {
		render(await ListingEditorPage(params as never))
		const breed = screen.getByLabelText("Breed")
		expect(within(breed).getByRole("option", { name: /Akita \(can't be sold/ })).toBeDisabled()
		expect(within(breed).getByRole("option", { name: /Rottweiler \(Specified Dog/ })).toBeEnabled()
	})

	it("shows the earliest legal handover as the date of birth changes", async () => {
		const user = userEvent.setup()
		render(await ListingEditorPage(params as never))

		expect(screen.getByLabelText("Ready to go home")).toHaveAccessibleDescription(
			"Puppies can go home at 9 weeks or older."
		)
		await user.type(screen.getByLabelText("Date of birth"), "2026-08-01")
		expect(screen.getByLabelText("Ready to go home")).toHaveAccessibleDescription(
			"Puppies can go home at 9 weeks: 3 Oct 2026 at the earliest."
		)
	})

	it("lets a complete listing be submitted", async () => {
		state.listing = completeListing()
		const user = userEvent.setup()
		render(await ListingEditorPage(params as never))

		expect(screen.getAllByLabelText("Complete")).toHaveLength(6)
		expect(screen.getByRole("img", { name: "Photo 1 of Sweet Beagle boy" })).toHaveAttribute(
			"src",
			"https://cdn.test/l/1.webp"
		)
		expect(screen.getByText("Ready to submit")).toBeInTheDocument()
		expect(screen.getByLabelText("Breed")).toHaveValue("13")
		expect(screen.getByLabelText("Price (SGD)")).toHaveValue("3200")
		expect(screen.getByLabelText("Weight in kg (optional)")).toHaveValue("4.5")
		expect(screen.getByRole("list", { name: "Health records" })).toHaveTextContent("Vaccination on 10 Sept 2026")

		await user.click(screen.getByRole("button", { name: "Submit for review" }))
		expect(actions.changeListingStatus).toHaveBeenCalledWith(LISTING_ID, "submit")
	})

	it("blocks submitting when the seller isn't verified", async () => {
		state.seller = makeSeller({ status: "pending" })
		state.listing = completeListing()
		render(await ListingEditorPage(params as never))
		expect(screen.getByText(/must be verified/)).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Submit for review" })).toBeDisabled()
	})

	it("shows imported sources and asks for the permit", async () => {
		state.listing = completeListing({
			source: "imported",
			importPermitNo: "IMP-1",
			arrivalDate: "2026-09-01",
			sourceLicenceNo: null,
		})
		render(await ListingEditorPage(params as never))
		expect(screen.getByLabelText("Import permit number")).toHaveValue("IMP-1")
		expect(screen.getByRole("region", { name: "Import permit" })).toBeInTheDocument()
		expect(screen.getByRole("list", { name: "Before you can submit" })).toHaveTextContent("Upload the import permit.")
	})

	it("tells breeders where their animals come from", async () => {
		state.seller = makeSeller({ status: "verified", sellerType: "breeder", licenceExpiresOn: "2099-01-01" })
		state.listing = completeListing({ source: "bred_on_premises", sourceLicenceNo: null })
		render(await ListingEditorPage(params as never))
		expect(screen.getByText(/Bred on your licensed premises/)).toBeInTheDocument()
		expect(screen.queryByRole("radiogroup", { name: "Source" })).toBeNull()
	})

	it("is read-only while live, with a way to revise", async () => {
		state.listing = completeListing({ status: "published", title: "Live pup" })
		render(await ListingEditorPage(params as never))

		expect(screen.getByRole("status", { name: "" })).toBeDefined()
		expect(screen.getByText(/This listing is live, so it can't be edited/)).toBeInTheDocument()
		expect(screen.getByLabelText("Colour")).toBeDisabled()
		expect(screen.queryByRole("button", { name: "Save" })).toBeNull()
		expect(screen.queryByRole("button", { name: "Add record" })).toBeNull()
		expect(screen.queryByRole("button", { name: /Remove/ })).toBeNull()
		expect(screen.getByText("Vaccination card:")).toBeInTheDocument()
	})

	it("explains other locked states", async () => {
		state.listing = completeListing({ status: "pending_review", documents: {}, documentKinds: [] })
		render(await ListingEditorPage(params as never))
		expect(screen.getByText("This listing can't be edited right now.")).toBeInTheDocument()
		expect(screen.getByText("Not uploaded")).toBeInTheDocument()
	})
})

describe("editor forms", () => {
	it("save each section and show Saved", async () => {
		actions.saveAnimal.mockResolvedValue({ saved: true })
		actions.saveListingInfo.mockResolvedValue({
			fieldErrors: { title: "Use at least 5 characters." },
			values: { title: "Pup" },
		})
		actions.saveMicrochip.mockResolvedValue({ formError: "Something went wrong." })
		actions.saveSource.mockResolvedValue({ fieldErrors: { source: "Choose where the animal comes from." } })
		const user = userEvent.setup()
		render(await ListingEditorPage(params as never))

		const animal = screen.getByRole("region", { name: "About the puppy" })
		await user.click(within(animal).getByRole("button", { name: "Save" }))
		expect(await within(animal).findByText("Saved")).toBeInTheDocument()

		const info = screen.getByRole("region", { name: "Title, price and description" })
		await user.click(within(info).getByRole("button", { name: "Save" }))
		expect(await within(info).findByText("Use at least 5 characters.")).toBeInTheDocument()
		expect(within(info).getByLabelText("Title")).toHaveValue("Pup")

		const health = screen.getByRole("region", { name: "Health" })
		await user.click(within(health).getByRole("button", { name: "Save microchip" }))
		expect(await within(health).findByText("Something went wrong.")).toBeInTheDocument()

		const source = screen.getByRole("region", { name: "Where the puppy comes from" })
		await user.click(within(source).getByLabelText(/From a licensed breeder/))
		expect(within(source).getByLabelText("Breeder's AVS licence number")).toBeInTheDocument()
		await user.click(within(source).getByLabelText(/Imported/))
		expect(within(source).getByLabelText("Arrival date")).toBeInTheDocument()
		await user.click(within(source).getByRole("button", { name: "Save" }))
		expect(await within(source).findByText("Choose where the animal comes from.")).toBeInTheDocument()
	})

	it("add and remove health records", async () => {
		state.listing = makeListing({
			healthRecords: [{ id: "h1", kind: "deworming", givenOn: "2026-08-01", product: "Drontal", clinic: "Vet" }],
		})
		actions.addHealthRecord.mockResolvedValue({
			fieldErrors: { givenOn: "Enter the date it was given." },
			values: { product: "DHP" },
		})
		actions.removeHealthRecord.mockResolvedValue({ error: "This listing can't be edited right now." })
		const user = userEvent.setup()
		render(await ListingEditorPage(params as never))

		await user.click(screen.getByRole("button", { name: "Add record" }))
		expect(await screen.findByText("Enter the date it was given.")).toBeInTheDocument()
		expect(screen.getByLabelText("Vaccine or dewormer")).toHaveValue("DHP")

		await user.click(screen.getByRole("button", { name: "Remove deworming on 1 aug 2026" }))
		expect(actions.removeHealthRecord).toHaveBeenCalledWith(LISTING_ID, "h1")
		expect(await screen.findByText("This listing can't be edited right now.")).toBeInTheDocument()
	})
})

describe("ListingActions", () => {
	const noIssues: ListingIssue[] = []

	it.each([
		["published", ["Mark as reserved", "Mark as sold", "Revise listing", "Archive"]],
		["reserved", ["Mark as available", "Mark as sold", "Revise listing", "Archive"]],
		["sold", ["Archive"]],
		["rejected", ["Archive"]],
		["suspended", ["Archive"]],
		["archived", []],
		["pending_review", []],
	] as const)("offers the right actions when %s", (status, buttons) => {
		render(<ListingActions listingId={LISTING_ID} status={status} issues={noIssues} canDelete={false} />)
		expect(screen.queryAllByRole("button").map((b) => b.textContent)).toEqual(buttons)
	})

	it("runs availability changes and shows errors", async () => {
		actions.changeListingStatus.mockResolvedValueOnce({}).mockResolvedValueOnce({ error: "Status changed." })
		const user = userEvent.setup()
		render(<ListingActions listingId={LISTING_ID} status="published" issues={noIssues} canDelete={false} />)

		await user.click(screen.getByRole("button", { name: "Mark as reserved" }))
		expect(actions.changeListingStatus).toHaveBeenCalledWith(LISTING_ID, "reserve")
		await user.click(screen.getByRole("button", { name: "Mark as sold" }))
		expect(await screen.findByRole("alert")).toHaveTextContent("Status changed.")
	})

	it("asks before revising, and can cancel", async () => {
		const user = userEvent.setup()
		render(<ListingActions listingId={LISTING_ID} status="reserved" issues={noIssues} canDelete={false} />)

		await user.click(screen.getByRole("button", { name: "Mark as available" }))
		expect(actions.changeListingStatus).toHaveBeenCalledWith(LISTING_ID, "unreserve")
		await user.click(screen.getByRole("button", { name: "Revise listing" }))
		expect(screen.getByText(/leaves the marketplace while you edit it/)).toBeInTheDocument()
		await user.click(screen.getByRole("button", { name: "Cancel" }))
		expect(screen.queryByRole("button", { name: "Yes, revise" })).toBeNull()

		await user.click(screen.getByRole("button", { name: "Revise listing" }))
		await user.click(screen.getByRole("button", { name: "Yes, revise" }))
		expect(actions.changeListingStatus).toHaveBeenCalledWith(LISTING_ID, "revise")
	})

	it("deletes never-submitted drafts and archives the rest", async () => {
		const user = userEvent.setup()
		const { rerender } = render(<ListingActions listingId={LISTING_ID} status="draft" issues={noIssues} canDelete />)
		await user.click(screen.getByRole("button", { name: "Delete draft" }))
		await user.click(screen.getByRole("button", { name: "Yes, delete" }))
		expect(actions.deleteDraft).toHaveBeenCalledWith(LISTING_ID)

		rerender(<ListingActions listingId={LISTING_ID} status="changes_requested" issues={noIssues} canDelete={false} />)
		await user.click(screen.getByRole("button", { name: "Archive" }))
		await user.click(screen.getByRole("button", { name: "Yes, archive" }))
		expect(actions.changeListingStatus).toHaveBeenCalledWith(LISTING_ID, "archive")
	})

	it("lists issues without a section as plain text", () => {
		render(
			<ListingActions
				listingId={LISTING_ID}
				status="draft"
				issues={[{ code: "seller_cannot_list", section: null, message: "Get verified first." }]}
				canDelete
			/>
		)
		const checklist = screen.getByRole("list", { name: "Before you can submit" })
		expect(within(checklist).queryByRole("link")).toBeNull()
		expect(checklist).toHaveTextContent("Get verified first.")
	})
})

describe("ListingsSummary", () => {
	it("invites sellers with no listings to create one", () => {
		render(<ListingsSummary listings={[]} canList={false} />)
		expect(screen.getByText(/submit them once your business is verified/)).toBeInTheDocument()
		expect(screen.queryByRole("link", { name: "Manage listings" })).toBeNull()
	})

	it("counts listings by group", () => {
		const base: SellerListingRow = {
			id: "l1",
			title: "x",
			status: "published",
			priceCents: 1,
			breedName: null,
			crossBreedName: null,
			dateOfBirth: null,
			updatedAt: "",
			coverUrl: null,
		}
		render(
			<ListingsSummary
				listings={[base, { ...base, id: "l2", status: "reserved" }, { ...base, id: "l3", status: "draft" }]}
				canList
			/>
		)
		expect(screen.getByText(/checked by Bibble before it goes live/)).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Manage listings" })).toHaveAttribute("href", "/seller/listings")
		expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("href", "/seller/listings?show=active")
		expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/seller/listings?show=drafts")
	})

	it("shows create-listing errors", async () => {
		actions.createListing.mockResolvedValue({ formError: "You can't create listings in this category yet." })
		const user = userEvent.setup()
		render(<ListingsSummary listings={[]} canList />)
		await user.click(screen.getByRole("button", { name: "Create listing" }))
		expect(await screen.findByRole("alert")).toHaveTextContent("can't create listings")
	})
})
