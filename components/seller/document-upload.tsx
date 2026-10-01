"use client"

import { recordSellerDocument } from "@/lib/sellers/actions"
import {
	documentFileError,
	documentLabels,
	documentStoragePath,
	formatBytes,
	isAllowedContentType,
	SELLER_DOCUMENTS_BUCKET,
} from "@/lib/sellers/documents"
import type { DocumentKind } from "@/lib/sellers/progress"
import type { SellerDocument } from "@/lib/sellers/queries"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { CircleCheckIcon, FileUpIcon, Loader2Icon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition, type ChangeEvent } from "react"

type DocumentUploadProps = { sellerId: string; kind: DocumentKind; current?: SellerDocument }

/**
 * Uploads straight from the browser to the private bucket (Storage policies limit it to the seller's folder), then
 * asks the server to record it. Keeps files out of Server Action bodies, which are capped at 1 MB.
 */
export function DocumentUpload({ sellerId, kind, current }: DocumentUploadProps) {
	const router = useRouter()
	const inputId = useId()
	const [error, setError] = useState<string | null>(null)
	const [uploading, setUploading] = useState(false)
	const [, startTransition] = useTransition()
	const { title, description } = documentLabels[kind]

	async function upload(event: ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		event.target.value = ""
		if (!file) {
			return
		}

		const fileError = documentFileError(file)
		if (fileError || !isAllowedContentType(file.type)) {
			setError(fileError)
			return
		}

		setError(null)
		setUploading(true)
		try {
			const path = documentStoragePath(sellerId, file.type, crypto.randomUUID())
			const { error: uploadError } = await createClient()
				.storage.from(SELLER_DOCUMENTS_BUCKET)
				.upload(path, file, { contentType: file.type, upsert: false })
			if (uploadError) {
				setError("Upload failed. Check your connection and try again.")
				return
			}

			const result = await recordSellerDocument({ kind, storagePath: path, fileName: file.name })
			if (result.error) {
				setError(result.error)
				return
			}
			startTransition(() => router.refresh())
		} finally {
			setUploading(false)
		}
	}

	return (
		<section
			aria-labelledby={`${inputId}-title`}
			className={cn("rounded-xl border p-5", current && "border-foreground/30")}
		>
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 id={`${inputId}-title`} className="text-lg font-semibold">
						{title}
					</h2>
					<p className="text-muted-foreground mt-1 text-sm">{description}</p>
				</div>
				{current && <CircleCheckIcon className="size-6 shrink-0 text-emerald-600" aria-label="Uploaded" />}
			</div>

			{current && (
				<p className="mt-4 text-sm">
					<span className="font-medium break-all">{current.fileName}</span>
					<span className="text-muted-foreground"> · {formatBytes(current.sizeBytes)}</span>
				</p>
			)}

			<div className="mt-4 flex items-center gap-3">
				<label
					htmlFor={inputId}
					className={cn(
						"focus-within:ring-ring/50 hover:bg-muted inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-4 text-sm font-medium focus-within:ring-3",
						uploading && "pointer-events-none opacity-60"
					)}
				>
					{uploading ? (
						<Loader2Icon className="size-4 animate-spin" aria-hidden />
					) : (
						<FileUpIcon className="size-4" aria-hidden />
					)}
					{uploading ? "Uploading…" : current ? "Replace file" : "Upload file"}
					<input
						id={inputId}
						type="file"
						accept="application/pdf,image/jpeg,image/png"
						className="sr-only"
						disabled={uploading}
						aria-describedby={error ? `${inputId}-error` : `${inputId}-hint`}
						onChange={upload}
					/>
				</label>
				<span id={`${inputId}-hint`} className="text-muted-foreground text-xs">
					PDF, JPG or PNG, up to 10 MB
				</span>
			</div>
			{error && (
				<p id={`${inputId}-error`} role="alert" className="text-destructive mt-3 text-sm">
					{error}
				</p>
			)}
		</section>
	)
}
