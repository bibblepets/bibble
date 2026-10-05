import { PhotosSection } from "@/components/listings/editor/photos-section"
import { ImageProcessingError } from "@/lib/listings/images"
import type { ListingImage } from "@/lib/listings/queries"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { LISTING_ID } from "./fixtures/listing"

// --- Photos section ---------------------------------------------------------------------------------------------------
const actions = vi.hoisted(() => ({
	addListingImage: vi.fn(),
	removeListingImage: vi.fn(),
	moveListingImage: vi.fn(),
}))
vi.mock("@/lib/listings/actions", () => actions)
const refresh = vi.hoisted(() => vi.fn())
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh }) }))
vi.mock("next/image", () => import("./mocks/next-image"))
const upload = vi.hoisted(() => vi.fn())
vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ storage: { from: () => ({ upload }) } }) }))
const prepare = vi.hoisted(() => vi.fn())
vi.mock("@/lib/listings/images", async (importOriginal) => ({
	...(await importOriginal<object>()),
	prepareImage: prepare,
}))

const image = (n: number): ListingImage => ({
	id: `i${n}`,
	url: `https://cdn.test/${n}.webp`,
	position: n - 1,
	width: 10,
	height: 10,
})
const jpg = (name: string) => new File(["x"], name, { type: "image/jpeg" })

describe("PhotosSection", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		for (const action of Object.values(actions)) action.mockResolvedValue({})
		upload.mockResolvedValue({ data: {}, error: null })
		prepare.mockImplementation(async () => ({
			blob: new Blob(["x"]),
			width: 1600,
			height: 1200,
			contentType: "image/webp",
		}))
	})

	it("uploads processed photos into the listing folder and records them", async () => {
		const user = userEvent.setup()
		render(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[]} editable />)

		await user.upload(screen.getByLabelText("Add photos"), [jpg("a.jpg"), jpg("b.jpg")])

		expect(upload).toHaveBeenCalledTimes(2)
		expect(upload.mock.calls[0][0]).toMatch(new RegExp(`^${LISTING_ID}/[\\w-]+\\.webp$`))
		expect(actions.addListingImage).toHaveBeenCalledWith(LISTING_ID, {
			storagePath: upload.mock.calls[0][0],
			width: 1600,
			height: 1200,
		})
		expect(refresh).toHaveBeenCalled()
	})

	it("only uploads as many as fit", async () => {
		const user = userEvent.setup()
		render(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[1, 2, 3, 4].map(image)} editable />)
		expect(screen.getByText(/add 1 more/)).toBeInTheDocument()

		await user.upload(screen.getByLabelText("Add photos"), [jpg("a.jpg"), jpg("b.jpg")])
		expect(upload).toHaveBeenCalledTimes(1)
	})

	it.each([
		[
			"processing",
			() => prepare.mockRejectedValue(new ImageProcessingError("We couldn't read that photo.")),
			"We couldn't read that photo.",
		],
		["unexpected", () => prepare.mockRejectedValue(new Error("boom")), "Something went wrong. Please try again."],
		["upload", () => upload.mockResolvedValue({ data: null, error: { message: "x" } }), /Upload failed/],
		[
			"recording",
			() => actions.addListingImage.mockResolvedValue({ error: "A listing can have up to 5 photos." }),
			/up to 5/,
		],
	])("reports %s errors", async (_label, arrange, message) => {
		arrange()
		const user = userEvent.setup()
		render(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[]} editable />)
		await user.upload(screen.getByLabelText("Add photos"), jpg("a.jpg"))
		expect(await screen.findByRole("alert")).toHaveTextContent(message)
	})

	it("ignores an empty selection", () => {
		render(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[]} editable />)
		screen.getByLabelText("Add photos").dispatchEvent(new Event("change", { bubbles: true }))
		expect(prepare).not.toHaveBeenCalled()
	})

	it("marks the cover and moves, promotes and removes photos", async () => {
		actions.removeListingImage.mockResolvedValue({ error: "That photo has already been removed." })
		const user = userEvent.setup()
		render(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[1, 2, 3].map(image)} editable />)

		expect(screen.getByText("Cover")).toBeInTheDocument()
		expect(screen.getByRole("img", { name: "Photo 1 of Beagle" })).toHaveAttribute("src", "https://cdn.test/1.webp")
		expect(screen.queryByRole("button", { name: "Make photo 1 the cover" })).toBeNull()
		expect(screen.getByRole("button", { name: "Move photo 1 earlier" })).toBeDisabled()
		expect(screen.getByRole("button", { name: "Move photo 3 later" })).toBeDisabled()

		await user.click(screen.getByRole("button", { name: "Make photo 3 the cover" }))
		expect(actions.moveListingImage).toHaveBeenCalledWith(LISTING_ID, "i3", "cover")
		await user.click(screen.getByRole("button", { name: "Move photo 2 earlier" }))
		expect(actions.moveListingImage).toHaveBeenCalledWith(LISTING_ID, "i2", "earlier")
		await user.click(screen.getByRole("button", { name: "Move photo 1 later" }))
		expect(actions.moveListingImage).toHaveBeenCalledWith(LISTING_ID, "i1", "later")
		await user.click(screen.getByRole("button", { name: "Remove photo 2" }))
		expect(await screen.findByRole("alert")).toHaveTextContent("already been removed")
	})

	it("explains the limit once full", () => {
		render(<PhotosSection listingId={LISTING_ID} title={null} images={[1, 2, 3, 4, 5].map(image)} editable />)
		expect(screen.queryByLabelText("Add photos")).toBeNull()
		expect(screen.getByText(/maximum of 5 photos/)).toBeInTheDocument()
		expect(screen.getByRole("img", { name: "Photo 1 of this listing" })).toBeInTheDocument()
	})

	it("is read-only when the listing is locked", () => {
		const { rerender } = render(
			<PhotosSection listingId={LISTING_ID} title="Beagle" images={[image(1)]} editable={false} />
		)
		expect(screen.queryByRole("button")).toBeNull()
		expect(screen.queryByLabelText("Add photos")).toBeNull()
		rerender(<PhotosSection listingId={LISTING_ID} title="Beagle" images={[]} editable={false} />)
		expect(screen.getByText("No photos.")).toBeInTheDocument()
	})
})
