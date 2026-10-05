import { env } from "@/lib/env"

export const LISTING_IMAGES_BUCKET = "listing-images"
export const MAX_LISTING_IMAGES = 5
/** Longest edge after resizing. Big enough for a full-width listing photo on a high-density screen. */
export const MAX_IMAGE_EDGE = 2000
/** Mirrors the bucket's file_size_limit. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const IMAGE_CONTENT_TYPES = ["image/webp", "image/jpeg", "image/png"] as const

/** Public CDN URL for an object in the listing-images bucket. */
export function listingImageUrl(storagePath: string): string {
	return `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${LISTING_IMAGES_BUCKET}/${storagePath}`
}

/** Scales width × height down (never up) so the longest edge is at most `max`. */
export function fitWithin(width: number, height: number, max: number = MAX_IMAGE_EDGE) {
	const scale = Math.min(1, max / Math.max(width, height))
	return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

export class ImageProcessingError extends Error {}

export type PreparedImage = {
	blob: Blob
	width: number
	height: number
	contentType: (typeof IMAGE_CONTENT_TYPES)[number]
}

/**
 * Resizes a photo and re-encodes it in the browser. Drawing to a canvas drops all EXIF metadata, including GPS
 * coordinates that would reveal the seller's private premises address. WebP where supported, otherwise JPEG.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
	if (!file.type.startsWith("image/")) {
		throw new ImageProcessingError("Choose a photo: JPG, PNG, WebP or HEIC.")
	}

	let bitmap: ImageBitmap
	try {
		// Applies the EXIF orientation before it's discarded, so portrait photos stay upright.
		bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
	} catch {
		throw new ImageProcessingError("We couldn't read that photo. Try a JPG or PNG.")
	}

	const { width, height } = fitWithin(bitmap.width, bitmap.height)
	const canvas = document.createElement("canvas")
	canvas.width = width
	canvas.height = height
	canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height)
	bitmap.close()

	const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.85))
	// Browsers that can't encode WebP silently return PNG instead.
	let blob = await encode("image/webp")
	if (blob?.type !== "image/webp") {
		blob = await encode("image/jpeg")
	}
	if (!blob) {
		throw new ImageProcessingError("We couldn't process that photo. Try another one.")
	}
	if (blob.size > MAX_IMAGE_BYTES) {
		throw new ImageProcessingError("That photo is too large even after resizing. Try another one.")
	}
	return { blob, width, height, contentType: blob.type as PreparedImage["contentType"] }
}

/** Object name for a processed photo, e.g. "<listing>/<uuid>.webp". */
export function listingImagePath(listingId: string, contentType: PreparedImage["contentType"], id: string): string {
	return `${listingId}/${id}.${contentType === "image/jpeg" ? "jpg" : contentType.slice("image/".length)}`
}
