"use client"

import { Button } from "@/components/ui/button"
import { addListingImage, moveListingImage, removeListingImage } from "@/lib/listings/actions"
import {
	ImageProcessingError,
	LISTING_IMAGES_BUCKET,
	listingImagePath,
	MAX_LISTING_IMAGES,
	prepareImage,
} from "@/lib/listings/images"
import type { ListingImage } from "@/lib/listings/queries"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeftIcon, ArrowRightIcon, ImagePlusIcon, Loader2Icon, StarIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useId, useState, useTransition, type ChangeEvent } from "react"

type PhotosSectionProps = { listingId: string; title: string | null; images: ListingImage[]; editable: boolean }

/** Up to 5 photos; the first is the cover. Photos are resized and stripped of metadata before upload. */
export function PhotosSection({ listingId, title, images, editable }: PhotosSectionProps) {
	const router = useRouter()
	const inputId = useId()
	const [busy, startTransition] = useTransition()
	const [progress, setProgress] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)
	const remaining = MAX_LISTING_IMAGES - images.length
	const name = title ?? "this listing"

	async function upload(event: ChangeEvent<HTMLInputElement>) {
		const files = Array.from(event.target.files ?? []).slice(0, remaining)
		event.target.value = ""
		if (files.length === 0) {
			return
		}
		setError(null)
		try {
			for (const [index, file] of files.entries()) {
				setProgress(files.length > 1 ? `Uploading ${index + 1} of ${files.length}…` : "Uploading…")
				const prepared = await prepareImage(file)
				const path = listingImagePath(listingId, prepared.contentType, crypto.randomUUID())
				const { error: uploadError } = await createClient()
					.storage.from(LISTING_IMAGES_BUCKET)
					.upload(path, prepared.blob, { contentType: prepared.contentType, upsert: false })
				if (uploadError) {
					setError("Upload failed. Check your connection and try again.")
					return
				}
				const result = await addListingImage(listingId, {
					storagePath: path,
					width: prepared.width,
					height: prepared.height,
				})
				if (result.error) {
					setError(result.error)
					return
				}
			}
		} catch (caught) {
			setError(caught instanceof ImageProcessingError ? caught.message : "Something went wrong. Please try again.")
		} finally {
			setProgress(null)
			startTransition(() => router.refresh())
		}
	}

	function act(action: () => Promise<{ error?: string }>) {
		setError(null)
		startTransition(async () => {
			const result = await action()
			setError(result.error ?? null)
		})
	}

	return (
		<div className="grid gap-4">
			{images.length === 0 && !editable && <p className="text-muted-foreground text-sm">No photos.</p>}
			<ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Photos">
				{images.map((image, index) => {
					const label = `photo ${index + 1}`
					return (
						<li key={image.id} className="grid gap-2">
							<div className="bg-muted relative aspect-square overflow-hidden rounded-xl">
								<Image
									src={image.url}
									alt={`Photo ${index + 1} of ${name}`}
									fill
									sizes="(min-width: 640px) 200px, 45vw"
									className="object-cover"
								/>
								{index === 0 && (
									<span className="bg-background/90 absolute top-2 left-2 rounded-full px-2 py-0.5 text-xs font-semibold">
										Cover
									</span>
								)}
							</div>
							{editable && (
								<div className="flex flex-wrap gap-1">
									{index > 0 && (
										<Button
											type="button"
											variant="ghost"
											size="icon-sm"
											disabled={busy}
											aria-label={`Make ${label} the cover`}
											onClick={() => act(() => moveListingImage(listingId, image.id, "cover"))}
										>
											<StarIcon aria-hidden />
										</Button>
									)}
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										disabled={busy || index === 0}
										aria-label={`Move ${label} earlier`}
										onClick={() => act(() => moveListingImage(listingId, image.id, "earlier"))}
									>
										<ArrowLeftIcon aria-hidden />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										disabled={busy || index === images.length - 1}
										aria-label={`Move ${label} later`}
										onClick={() => act(() => moveListingImage(listingId, image.id, "later"))}
									>
										<ArrowRightIcon aria-hidden />
									</Button>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										disabled={busy}
										aria-label={`Remove ${label}`}
										onClick={() => act(() => removeListingImage(listingId, image.id))}
										className="ml-auto"
									>
										<Trash2Icon aria-hidden />
									</Button>
								</div>
							)}
						</li>
					)
				})}
				{editable && remaining > 0 && (
					<li>
						<label
							htmlFor={inputId}
							className="text-muted-foreground hover:bg-muted focus-within:ring-ring/50 flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-medium focus-within:ring-3"
						>
							{progress ? (
								<Loader2Icon className="size-6 animate-spin" aria-hidden />
							) : (
								<ImagePlusIcon className="size-6" aria-hidden />
							)}
							{progress ?? "Add photos"}
							<input
								id={inputId}
								type="file"
								accept="image/*"
								multiple
								className="sr-only"
								disabled={Boolean(progress)}
								aria-describedby={`${inputId}-hint`}
								onChange={upload}
							/>
						</label>
					</li>
				)}
			</ul>
			{editable && (
				<p id={`${inputId}-hint`} className="text-muted-foreground text-sm">
					{remaining > 0
						? `You can add ${remaining} more. We resize photos and remove location data before uploading.`
						: "That's the maximum of 5 photos. Remove one to add another."}
				</p>
			)}
			{error && (
				<p role="alert" className="text-destructive text-sm">
					{error}
				</p>
			)}
		</div>
	)
}
