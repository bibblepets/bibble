import "server-only"

import { getCurrentUser, requireUser } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { cache } from "react"
import type { DocumentKind, SellerProgressInput, SellerStatus } from "./progress"
import type { SellerType } from "./schema"

export type SellerDocument = {
	id: string
	kind: DocumentKind
	fileName: string
	sizeBytes: number
	createdAt: string
}

export type CurrentSeller = SellerProgressInput & {
	id: string
	role: "owner" | "staff"
	slug: string | null
	sellerType: SellerType
	about: string | null
	area: { name: string; region: string } | null
	addressLine2: string | null
	species: { slug: string; name: string }[]
	/** The newest document of each kind. */
	documents: Partial<Record<DocumentKind, SellerDocument>>
	submittedAt: string | null
	verifiedAt: string | null
}

const sellerColumns = `
	role,
	seller:sellers (
		id, slug, seller_type, display_name, legal_name, uen, licence_no, licence_expires_on, about, area_id,
		verification_status, submitted_at, verified_at,
		area:areas ( name, region ),
		private:seller_private_details ( address_line1, address_line2, postal_code, contact_phone, contact_email ),
		seller_species ( species ( slug, name ) ),
		seller_documents ( id, kind, file_name, size_bytes, created_at )
	)
`

/**
 * Loads a seller through a membership row: the signed-in user's own (by user_id), or a seller's owner (by
 * seller_id, which RLS only allows for members and admins).
 */
async function loadSeller(filter: { user_id: string } | { seller_id: string }): Promise<CurrentSeller | null> {
	const supabase = await createClient()
	const query = supabase.from("seller_members").select(sellerColumns)
	const { data, error } = await (
		"user_id" in filter
			? query.eq("user_id", filter.user_id)
			: query.eq("seller_id", filter.seller_id).eq("role", "owner")
	).maybeSingle()

	if (error) {
		throw new Error(`Failed to load seller: ${error.message}`)
	}
	if (!data?.seller) {
		return null
	}

	const { seller } = data
	const documents: CurrentSeller["documents"] = {}
	const newestFirst = seller.seller_documents.toSorted((a, b) => b.created_at.localeCompare(a.created_at))
	for (const doc of newestFirst) {
		const kind = doc.kind as DocumentKind
		documents[kind] ??= {
			id: doc.id,
			kind,
			fileName: doc.file_name,
			sizeBytes: doc.size_bytes,
			createdAt: doc.created_at,
		}
	}
	const species = seller.seller_species.flatMap(({ species }) => (species ? [species] : []))

	return {
		id: seller.id,
		role: data.role as CurrentSeller["role"],
		slug: seller.slug,
		status: seller.verification_status as SellerStatus,
		sellerType: seller.seller_type as SellerType,
		displayName: seller.display_name,
		legalName: seller.legal_name,
		uen: seller.uen,
		licenceNo: seller.licence_no,
		licenceExpiresOn: seller.licence_expires_on,
		about: seller.about,
		areaId: seller.area_id,
		area: seller.area,
		addressLine1: seller.private?.address_line1 ?? null,
		addressLine2: seller.private?.address_line2 ?? null,
		postalCode: seller.private?.postal_code ?? null,
		contactPhone: seller.private?.contact_phone ?? null,
		contactEmail: seller.private?.contact_email ?? null,
		species,
		speciesCount: species.length,
		documents,
		documentKinds: Object.keys(documents) as DocumentKind[],
		submittedAt: seller.submitted_at,
		verifiedAt: seller.verified_at,
	}
}

/** The signed-in user's seller account, or null. Memoised per request. */
export const getCurrentSeller = cache(async (): Promise<CurrentSeller | null> => {
	const user = await getCurrentUser()
	return user ? loadSeller({ user_id: user.id }) : null
})

/** Any seller by id, as its owner sees it. Returns null unless the caller is a member or an admin (RLS). */
export const getSellerById = cache((sellerId: string) => loadSeller({ seller_id: sellerId }))

export type SellerFeedback = { decision: string; message: string | null; createdAt: string }

/** The latest admin decision on the seller and its message, without internal notes. */
export const getSellerFeedback = cache(async (sellerId: string): Promise<SellerFeedback | null> => {
	const supabase = await createClient()
	const { data, error } = await supabase.rpc("get_seller_feedback", { p_seller_id: sellerId }).maybeSingle()
	if (error) {
		throw new Error(`Failed to load seller feedback: ${error.message}`)
	}
	return data ? { decision: data.decision, message: data.message, createdAt: data.created_at } : null
})

/** The signed-in user's seller, sending them to log in or to onboarding when they have none. */
export async function requireSeller(returnTo: string): Promise<CurrentSeller> {
	await requireUser(returnTo)
	const seller = await getCurrentSeller()
	if (!seller) {
		redirect("/seller/onboarding")
	}
	return seller
}

export type Area = { id: number; name: string; region: string }

export const listAreas = cache(async (): Promise<Area[]> => {
	const supabase = await createClient()
	const { data, error } = await supabase.from("areas").select("id, name, region").order("name")
	if (error) {
		throw new Error(`Failed to load areas: ${error.message}`)
	}
	return data
})

export type Species = { id: number; slug: string; name: string; isActive: boolean }

export const listSpecies = cache(async (): Promise<Species[]> => {
	const supabase = await createClient()
	const { data, error } = await supabase.from("species").select("id, slug, name, is_active").order("id")
	if (error) {
		throw new Error(`Failed to load species: ${error.message}`)
	}
	return data.map(({ is_active, ...species }) => ({ ...species, isActive: is_active }))
})
