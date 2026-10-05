"use client"

import { FileUpload } from "@/components/forms/file-upload"
import { recordSellerDocument } from "@/lib/sellers/actions"
import { documentLabels, SELLER_DOCUMENTS_BUCKET } from "@/lib/sellers/documents"
import type { DocumentKind } from "@/lib/sellers/progress"
import type { SellerDocument } from "@/lib/sellers/queries"

type DocumentUploadProps = { sellerId: string; kind: DocumentKind; current?: SellerDocument }

/** A seller verification document, stored in the seller's folder. */
export function DocumentUpload({ sellerId, kind, current }: DocumentUploadProps) {
	return (
		<FileUpload
			bucket={SELLER_DOCUMENTS_BUCKET}
			folder={sellerId}
			{...documentLabels[kind]}
			current={current}
			record={(upload) => recordSellerDocument({ kind, ...upload })}
		/>
	)
}
