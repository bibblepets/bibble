import "server-only"

import { createClient } from "@/lib/supabase/server"
import { cache } from "react"
import { listingImageUrl } from "./images"
import type { ListingStatus } from "./status"

export type Breed = { id: number; name: string; specifiedPart: number | null }

/** Breeds for a species, alphabetical. */
export const listBreeds = cache(async (speciesSlug: string = "dog"): Promise<Breed[]> => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from("breeds")
		.select("id, name, specified_part, species!inner ( slug )")
		.eq("species.slug", speciesSlug)
		.order("name")
	if (error) {
		throw new Error(`Failed to load breeds: ${error.message}`)
	}
	return data.map((breed) => ({ id: breed.id, name: breed.name, specifiedPart: breed.specified_part }))
})

export type SellerListingRow = {
	id: string
	title: string | null
	status: ListingStatus
	priceCents: number | null
	breedName: string | null
	crossBreedName: string | null
	dateOfBirth: string | null
	updatedAt: string
	/** Public URL of the cover photo, if any. */
	coverUrl: string | null
}

/** A seller's listings, most recently updated first. RLS limits this to members and admins. */
export const listSellerListings = cache(async (sellerId: string): Promise<SellerListingRow[]> => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from("listings")
		.select(
			`id, title, status, price_cents, updated_at,
			listing_images ( storage_path, position ),
			details:pet_listing_details (
				date_of_birth,
				breed:breeds!pet_listing_details_breed_id_fkey ( name ),
				cross:breeds!pet_listing_details_cross_breed_id_fkey ( name )
			)`
		)
		.eq("seller_id", sellerId)
		.order("updated_at", { ascending: false })
	if (error) {
		throw new Error(`Failed to load listings: ${error.message}`)
	}
	return data.map((row) => {
		const details = row.details[0]
		const cover = row.listing_images.find((image) => image.position === 0)
		return {
			id: row.id,
			title: row.title,
			status: row.status as ListingStatus,
			priceCents: row.price_cents,
			breedName: details?.breed?.name ?? null,
			crossBreedName: details?.cross?.name ?? null,
			dateOfBirth: details?.date_of_birth ?? null,
			updatedAt: row.updated_at,
			coverUrl: cover ? listingImageUrl(cover.storage_path) : null,
		}
	})
})

export type HealthRecord = {
	id: string
	kind: "vaccination" | "deworming"
	givenOn: string
	product: string
	clinic: string | null
}

export type ListingImage = { id: string; url: string; position: number; width: number; height: number }

export type ListingDocument = { id: string; kind: string; fileName: string; sizeBytes: number; createdAt: string }

export type ListingForEdit = {
	id: string
	sellerId: string
	status: ListingStatus
	category: { slug: string; name: string }
	title: string | null
	description: string | null
	priceCents: number | null
	submittedAt: string | null
	publishedAt: string | null
	updatedAt: string
	breed: Breed | null
	crossBreed: Breed | null
	sex: "male" | "female" | null
	dateOfBirth: string | null
	readyDate: string | null
	colour: string | null
	weightKg: number | null
	heightCm: number | null
	sterilised: boolean
	microchipNo: string | null
	source: "bred_on_premises" | "licensed_breeder" | "imported" | null
	sourceLicenceNo: string | null
	importPermitNo: string | null
	arrivalDate: string | null
	healthRecords: HealthRecord[]
	/** The newest document of each kind. */
	documents: Record<string, ListingDocument>
	documentKinds: string[]
	/** Photos in display order; the first is the cover. */
	images: ListingImage[]
	imageCount: number
}

const breedColumns = "id, name, specified_part"

/** Everything the editor needs. Null when the listing doesn't exist or the caller can't see it (RLS). */
export const getListingForEdit = cache(async (listingId: string): Promise<ListingForEdit | null> => {
	const supabase = await createClient()
	const { data: row, error } = await supabase
		.from("listings")
		.select(
			`id, seller_id, status, title, description, price_cents, submitted_at, published_at, updated_at,
			category:categories ( slug, name ),
			details:pet_listing_details (
				sex, date_of_birth, ready_date, colour, weight_kg, height_cm, sterilised,
				breed:breeds!pet_listing_details_breed_id_fkey ( ${breedColumns} ),
				cross:breeds!pet_listing_details_cross_breed_id_fkey ( ${breedColumns} )
			),
			private:pet_listing_private ( microchip_no, source, source_licence_no, import_permit_no, arrival_date ),
			pet_health_records ( id, kind, given_on, product, clinic ),
			listing_documents ( id, kind, file_name, size_bytes, created_at ),
			listing_images ( id, storage_path, position, width, height )`
		)
		.eq("id", listingId)
		.maybeSingle()
	if (error) {
		throw new Error(`Failed to load listing: ${error.message}`)
	}
	if (!row) {
		return null
	}

	const details = row.details[0]
	const documents: Record<string, ListingDocument> = {}
	for (const doc of row.listing_documents.toSorted((a, b) => b.created_at.localeCompare(a.created_at))) {
		documents[doc.kind] ??= {
			id: doc.id,
			kind: doc.kind,
			fileName: doc.file_name,
			sizeBytes: doc.size_bytes,
			createdAt: doc.created_at,
		}
	}
	const toBreed = (breed: { id: number; name: string; specified_part: number | null } | null | undefined) =>
		breed ? { id: breed.id, name: breed.name, specifiedPart: breed.specified_part } : null

	return {
		id: row.id,
		sellerId: row.seller_id,
		status: row.status as ListingStatus,
		category: row.category,
		title: row.title,
		description: row.description,
		priceCents: row.price_cents,
		submittedAt: row.submitted_at,
		publishedAt: row.published_at,
		updatedAt: row.updated_at,
		breed: toBreed(details?.breed),
		crossBreed: toBreed(details?.cross),
		sex: (details?.sex as ListingForEdit["sex"]) ?? null,
		dateOfBirth: details?.date_of_birth ?? null,
		readyDate: details?.ready_date ?? null,
		colour: details?.colour ?? null,
		weightKg: details?.weight_kg ?? null,
		heightCm: details?.height_cm ?? null,
		sterilised: details?.sterilised ?? false,
		microchipNo: row.private?.microchip_no ?? null,
		source: (row.private?.source as ListingForEdit["source"]) ?? null,
		sourceLicenceNo: row.private?.source_licence_no ?? null,
		importPermitNo: row.private?.import_permit_no ?? null,
		arrivalDate: row.private?.arrival_date ?? null,
		healthRecords: row.pet_health_records
			.map((record) => ({
				id: record.id,
				kind: record.kind as HealthRecord["kind"],
				givenOn: record.given_on,
				product: record.product,
				clinic: record.clinic,
			}))
			.toSorted((a, b) => a.givenOn.localeCompare(b.givenOn)),
		documents,
		documentKinds: Object.keys(documents),
		images: row.listing_images
			.map((image) => ({
				id: image.id,
				url: listingImageUrl(image.storage_path),
				position: image.position,
				width: image.width,
				height: image.height,
			}))
			.toSorted((a, b) => a.position - b.position),
		imageCount: row.listing_images.length,
	}
})
