import { fitWithin, ImageProcessingError, listingImagePath, listingImageUrl, prepareImage } from "@/lib/listings/images"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

describe("image helpers", () => {
	it.each([
		[4000, 3000, { width: 2000, height: 1500 }],
		[1200, 3600, { width: 667, height: 2000 }],
		[800, 600, { width: 800, height: 600 }],
		[9999, 1, { width: 2000, height: 1 }],
	])("fits %i×%i within 2000px", (width, height, expected) => {
		expect(fitWithin(width, height)).toEqual(expected)
	})

	it("builds paths and public URLs", () => {
		expect(listingImagePath("l1", "image/webp", "abc")).toBe("l1/abc.webp")
		expect(listingImagePath("l1", "image/jpeg", "abc")).toBe("l1/abc.jpg")
		expect(listingImageUrl("l1/abc.webp")).toBe(
			"http://127.0.0.1:54321/storage/v1/object/public/listing-images/l1/abc.webp"
		)
	})
})

describe("prepareImage", () => {
	const drawImage = vi.fn()
	let encoded: (type: string) => Blob | null

	beforeEach(() => {
		encoded = (type) => new Blob(["x"], { type })
		vi.stubGlobal(
			"createImageBitmap",
			vi.fn(async () => ({ width: 4000, height: 3000, close: vi.fn() }))
		)
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({ drawImage } as never)
		vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(function (callback, type) {
			callback(encoded(type!))
		})
	})
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.restoreAllMocks()
	})

	const photo = new File(["raw"], "dog.jpg", { type: "image/jpeg" })

	it("resizes and re-encodes as WebP, applying EXIF orientation first", async () => {
		const prepared = await prepareImage(photo)
		expect(prepared).toMatchObject({ width: 2000, height: 1500, contentType: "image/webp" })
		expect(createImageBitmap).toHaveBeenCalledWith(photo, { imageOrientation: "from-image" })
		expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 2000, 1500)
	})

	it("falls back to JPEG where WebP encoding isn't supported", async () => {
		encoded = (type) => new Blob(["x"], { type: type === "image/webp" ? "image/png" : type })
		expect((await prepareImage(photo)).contentType).toBe("image/jpeg")
	})

	it.each([
		["a non-image", () => prepareImage(new File(["x"], "a.pdf", { type: "application/pdf" })), /Choose a photo/],
		[
			"an unreadable image",
			() => {
				vi.stubGlobal(
					"createImageBitmap",
					vi.fn(async () => Promise.reject(new Error("bad")))
				)
				return prepareImage(photo)
			},
			/couldn't read that photo/,
		],
		[
			"a failed encode",
			() => {
				encoded = () => null
				return prepareImage(photo)
			},
			/couldn't process/,
		],
		[
			"an encode that's still too large",
			() => {
				encoded = (type) => new Blob([new Uint8Array(6 * 1024 * 1024)], { type })
				return prepareImage(photo)
			},
			/too large/,
		],
	])("rejects %s", async (_label, run, message) => {
		const error = await run().catch((caught: unknown) => caught)
		expect(error).toBeInstanceOf(ImageProcessingError)
		expect((error as Error).message).toMatch(message)
	})
})
