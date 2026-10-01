import "server-only"

import { sellerStatuses, type SellerStatus } from "@/lib/sellers/progress"
import { getSellerById, type CurrentSeller } from "@/lib/sellers/queries"
import type { SellerType } from "@/lib/sellers/schema"
import { createClient } from "@/lib/supabase/server"
import { cache } from "react"

// Admin data relies on RLS and the admin-only functions; callers still run requireAdmin() first.

export const countSellersByStatus = cache(async (): Promise<Record<SellerStatus, number>> => {
	const supabase = await createClient()
	const { data, error } = await supabase.rpc("admin_seller_status_counts")
	if (error) {
		throw new Error(`Failed to count sellers: ${error.message}`)
	}
	const counts = Object.fromEntries(sellerStatuses.map((status) => [status, 0])) as Record<SellerStatus, number>
	for (const { status, total } of data) {
		counts[status as SellerStatus] = Number(total)
	}
	return counts
})

export type SellerQueueRow = {
	id: string
	displayName: string | null
	sellerType: SellerType
	uen: string | null
	licenceNo: string | null
	area: { name: string; region: string } | null
	submittedAt: string | null
	updatedAt: string
}

/** Sellers in a status. Pending is oldest submission first (a queue); the rest most recently changed first. */
export async function listSellersForReview(status: SellerStatus): Promise<SellerQueueRow[]> {
	const supabase = await createClient()
	const query = supabase
		.from("sellers")
		.select("id, display_name, seller_type, uen, licence_no, submitted_at, updated_at, area:areas ( name, region )")
		.eq("verification_status", status)
	const { data, error } = await (
		status === "pending"
			? query.order("submitted_at", { ascending: true })
			: query.order("updated_at", { ascending: false })
	).limit(200)
	if (error) {
		throw new Error(`Failed to load sellers: ${error.message}`)
	}
	return data.map((row) => ({
		id: row.id,
		displayName: row.display_name,
		sellerType: row.seller_type as SellerType,
		uen: row.uen,
		licenceNo: row.licence_no,
		area: row.area,
		submittedAt: row.submitted_at,
		updatedAt: row.updated_at,
	}))
}

export type ReviewEntry = {
	id: string
	decision: string
	message: string | null
	internalNote: string | null
	checklist: string[]
	reviewerName: string | null
	createdAt: string
}

export type SellerForReview = {
	seller: CurrentSeller
	owner: { email: string; displayName: string | null } | null
	history: ReviewEntry[]
}

export const getSellerForReview = cache(async (sellerId: string): Promise<SellerForReview | null> => {
	const seller = await getSellerById(sellerId)
	if (!seller) {
		return null
	}

	const supabase = await createClient()
	const [owner, history] = await Promise.all([
		supabase.rpc("admin_seller_owner", { p_seller_id: sellerId }).maybeSingle(),
		supabase
			.from("seller_reviews")
			.select("id, decision, message, internal_note, checklist, created_at, reviewer:profiles ( display_name )")
			.eq("seller_id", sellerId)
			.order("created_at", { ascending: false }),
	])
	if (owner.error || history.error) {
		throw new Error(`Failed to load seller review: ${(owner.error ?? history.error)!.message}`)
	}

	return {
		seller,
		owner: owner.data ? { email: owner.data.email, displayName: owner.data.display_name } : null,
		history: history.data.map((row) => ({
			id: row.id,
			decision: row.decision,
			message: row.message,
			internalNote: row.internal_note,
			checklist: row.checklist,
			reviewerName: row.reviewer?.display_name ?? null,
			createdAt: row.created_at,
		})),
	}
})

const SIGNED_URL_SECONDS = 60

/** A short-lived link to a seller document, or null if it (or its file) doesn't exist. */
export async function signedDocumentUrl(documentId: string): Promise<string | null> {
	const supabase = await createClient()
	const { data: doc } = await supabase
		.from("seller_documents")
		.select("storage_path")
		.eq("id", documentId)
		.maybeSingle()
	if (!doc) {
		return null
	}
	const { data } = await supabase.storage.from("seller-documents").createSignedUrl(doc.storage_path, SIGNED_URL_SECONDS)
	return data?.signedUrl ?? null
}
