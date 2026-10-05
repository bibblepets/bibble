"use server"

import { requireUser } from "@/lib/auth/session"
import { fieldErrorsFrom, valuesFrom, type ActionState } from "@/lib/forms"
import { documentFileError } from "@/lib/sellers/documents"
import { requireSeller } from "@/lib/sellers/queries"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { LISTING_DOCUMENTS_BUCKET, listingDocumentKinds, type ListingDocumentKind } from "./documents"
import { listingErrorMessage } from "./errors"
import { animalSchema, healthRecordSchema, listingSchema, microchipSchema, sourceSchema } from "./schema"
import { listingPath, requireOwnListing } from "./session"

export type AnimalField =
	"breedId" | "crossBreedId" | "sex" | "colour" | "dateOfBirth" | "readyDate" | "weightKg" | "heightCm" | "sterilised"
export type ListingField = "title" | "priceCents" | "description"
export type MicrochipField = "microchipNo"
export type HealthRecordField = "kind" | "givenOn" | "product" | "clinic"
export type SourceField = "source" | "sourceLicenceNo" | "importPermitNo" | "arrivalDate"

const SAVED = { saved: true } as const

/** Starts a draft dog listing for the signed-in seller and opens the editor. */
export async function createListing(): Promise<ActionState> {
	const seller = await requireSeller("/seller/listings")
	const supabase = await createClient()
	const { data, error } = await supabase.rpc("create_listing", { p_seller_id: seller.id, p_category: "dogs" })
	if (error) {
		return { formError: listingErrorMessage(error) }
	}
	revalidatePath("/seller", "layout")
	redirect(listingPath(data))
}

/** Runs a write and turns a database error into an ActionState, or revalidates the editor. */
async function finish<Field extends string>(
	listingId: string,
	errors: ({ message?: string } | null)[],
	values?: Partial<Record<Field, string>>
): Promise<ActionState<Field>> {
	const error = errors.find(Boolean)
	if (error) {
		return { formError: listingErrorMessage(error), values }
	}
	revalidatePath(listingPath(listingId))
	return SAVED
}

export async function saveAnimal(
	listingId: string,
	_prev: ActionState<AnimalField>,
	formData: FormData
): Promise<ActionState<AnimalField>> {
	await requireOwnListing(listingId)
	const values = valuesFrom(formData, [
		"breedId",
		"crossBreedId",
		"sex",
		"colour",
		"dateOfBirth",
		"readyDate",
		"weightKg",
		"heightCm",
		"sterilised",
	] as const)
	const parsed = animalSchema().safeParse({ crossBreedId: "", weightKg: "", heightCm: "", ...values })
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const animal = parsed.data
	const supabase = await createClient()
	const { error } = await supabase
		.from("pet_listing_details")
		.update({
			breed_id: animal.breedId,
			cross_breed_id: animal.crossBreedId,
			sex: animal.sex,
			colour: animal.colour,
			date_of_birth: animal.dateOfBirth,
			ready_date: animal.readyDate,
			weight_kg: animal.weightKg,
			height_cm: animal.heightCm,
			sterilised: animal.sterilised,
		})
		.eq("listing_id", listingId)
	return finish(listingId, [error], values)
}

export async function saveListingInfo(
	listingId: string,
	_prev: ActionState<ListingField>,
	formData: FormData
): Promise<ActionState<ListingField>> {
	await requireOwnListing(listingId)
	const values = valuesFrom(formData, ["title", "priceCents", "description"] as const)
	const parsed = listingSchema.safeParse({ description: "", ...values })
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from("listings")
		.update({ title: parsed.data.title, price_cents: parsed.data.priceCents, description: parsed.data.description })
		.eq("id", listingId)
	return finish(listingId, [error], values)
}

export async function saveMicrochip(
	listingId: string,
	_prev: ActionState<MicrochipField>,
	formData: FormData
): Promise<ActionState<MicrochipField>> {
	await requireOwnListing(listingId)
	const values = valuesFrom(formData, ["microchipNo"] as const)
	const parsed = microchipSchema.safeParse(values)
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const supabase = await createClient()
	const { error } = await supabase
		.from("pet_listing_private")
		.update({ microchip_no: parsed.data.microchipNo })
		.eq("listing_id", listingId)
	return finish(listingId, [error], values)
}

export async function addHealthRecord(
	listingId: string,
	_prev: ActionState<HealthRecordField>,
	formData: FormData
): Promise<ActionState<HealthRecordField>> {
	await requireOwnListing(listingId)
	const values = valuesFrom(formData, ["kind", "givenOn", "product", "clinic"] as const)
	const parsed = healthRecordSchema().safeParse({ clinic: "", ...values })
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const { kind, givenOn, product, clinic } = parsed.data
	const supabase = await createClient()
	const { error } = await supabase
		.from("pet_health_records")
		.insert({ listing_id: listingId, kind, given_on: givenOn, product, clinic })
	return finish(listingId, [error], values)
}

export async function removeHealthRecord(listingId: string, recordId: string): Promise<{ error?: string }> {
	await requireOwnListing(listingId)
	const supabase = await createClient()
	const { error } = await supabase.from("pet_health_records").delete().eq("id", recordId).eq("listing_id", listingId)
	if (error) {
		return { error: listingErrorMessage(error) }
	}
	revalidatePath(listingPath(listingId))
	return {}
}

export async function saveSource(
	listingId: string,
	_prev: ActionState<SourceField>,
	formData: FormData
): Promise<ActionState<SourceField>> {
	const { seller } = await requireOwnListing(listingId)
	const values = valuesFrom(formData, ["source", "sourceLicenceNo", "importPermitNo", "arrivalDate"] as const)
	const parsed = sourceSchema(seller.sellerType).safeParse(values)
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const source = parsed.data
	const supabase = await createClient()
	const { error } = await supabase
		.from("pet_listing_private")
		.update({
			source: source.source,
			source_licence_no: "sourceLicenceNo" in source ? source.sourceLicenceNo : null,
			import_permit_no: "importPermitNo" in source ? source.importPermitNo : null,
			arrival_date: "arrivalDate" in source ? source.arrivalDate : null,
		})
		.eq("listing_id", listingId)
	return finish(listingId, [error], values)
}

/**
 * Records a document the browser has already uploaded to the listing's folder. Size and type are read back from
 * Storage rather than trusted from the client.
 */
export async function recordListingDocument(
	listingId: string,
	kind: ListingDocumentKind,
	upload: { storagePath: string; fileName: string }
): Promise<{ error?: string }> {
	await requireOwnListing(listingId)
	const { storagePath, fileName } = upload
	const objectName = storagePath.slice(listingId.length + 1)
	if (
		!listingDocumentKinds.includes(kind) ||
		!storagePath.startsWith(`${listingId}/`) ||
		!/^[\w-]+\.(pdf|jpe?g|png)$/i.test(objectName) ||
		!fileName.trim()
	) {
		return { error: "That upload doesn't look right. Please try again." }
	}

	const supabase = await createClient()
	const { data: info, error: infoError } = await supabase.storage.from(LISTING_DOCUMENTS_BUCKET).info(storagePath)
	if (infoError || !info) {
		return { error: "We couldn't find your upload. Please try again." }
	}
	const fileError = documentFileError({ type: info.contentType ?? "", size: info.size ?? 0 })
	if (fileError) {
		return { error: fileError }
	}

	const user = await requireUser(listingPath(listingId))
	const { error } = await supabase.from("listing_documents").insert({
		listing_id: listingId,
		kind,
		storage_path: storagePath,
		file_name: fileName.trim().slice(0, 255),
		content_type: info.contentType!,
		size_bytes: info.size!,
		uploaded_by: user.id,
	})
	if (error) {
		return { error: listingErrorMessage(error) }
	}
	revalidatePath(listingPath(listingId))
	return {}
}

type StatusAction = "submit" | "revise" | "reserve" | "unreserve" | "sell" | "archive"

/** Status changes from the editor's action panel. Each goes through its database function. */
export async function changeListingStatus(listingId: string, action: StatusAction): Promise<{ error?: string }> {
	await requireOwnListing(listingId)
	const supabase = await createClient()
	const id = { p_listing_id: listingId }
	const { error } = await (action === "submit"
		? supabase.rpc("submit_listing_for_review", id)
		: action === "revise"
			? supabase.rpc("revise_listing", id)
			: action === "archive"
				? supabase.rpc("archive_listing", id)
				: supabase.rpc("set_listing_availability", {
						...id,
						p_status: action === "reserve" ? "reserved" : action === "sell" ? "sold" : "published",
					}))
	if (error) {
		return { error: listingErrorMessage(error) }
	}
	revalidatePath("/seller", "layout")
	return {}
}

/** Deletes a draft that was never submitted, then returns to the listings table. */
export async function deleteDraft(listingId: string): Promise<{ error?: string }> {
	await requireOwnListing(listingId)
	const supabase = await createClient()
	const { error, count } = await supabase.from("listings").delete({ count: "exact" }).eq("id", listingId)
	if (error || count === 0) {
		return { error: "Only drafts that were never submitted can be deleted. Archive it instead." }
	}
	revalidatePath("/seller", "layout")
	redirect("/seller/listings")
}
