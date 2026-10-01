import type { DocumentKind } from "./progress"

export const SELLER_DOCUMENTS_BUCKET = "seller-documents"
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024

const extensions = { "application/pdf": "pdf", "image/jpeg": "jpg", "image/png": "png" } as const
export type DocumentContentType = keyof typeof extensions

export function isAllowedContentType(type: string): type is DocumentContentType {
	return type in extensions
}

export const documentLabels: Record<DocumentKind, { title: string; description: string }> = {
	avs_licence: {
		title: "AVS licence",
		description: "Your current pet shop or breeding licence from AVS, showing the licence number and expiry date.",
	},
	acra_bizfile: {
		title: "ACRA BizFile",
		description: "A recent business profile from ACRA BizFile showing your UEN and registered name.",
	},
}

/** Why a file can't be uploaded, or null if it's fine. Mirrors the bucket's own limits. */
export function documentFileError(file: { type: string; size: number }): string | null {
	if (!isAllowedContentType(file.type)) {
		return "Upload a PDF, JPG or PNG."
	}
	if (file.size === 0) {
		return "That file is empty."
	}
	if (file.size > MAX_DOCUMENT_BYTES) {
		return "Files can be up to 10 MB."
	}
	return null
}

/** Object name under the seller's folder. Random, so re-uploads never overwrite earlier files. */
export function documentStoragePath(sellerId: string, contentType: DocumentContentType, id: string): string {
	return `${sellerId}/${id}.${extensions[contentType]}`
}

/** Human-readable size, e.g. "2.4 MB". */
export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
