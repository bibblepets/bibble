"use server"

import { fieldErrorsFrom, valuesFrom, type ActionState } from "@/lib/forms"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { adminErrorMessage } from "./errors"
import { correctionSchema, reviewSchema } from "./schema"
import { requireAdmin } from "./session"

export type ReviewField = "decision" | "message" | "internalNote" | "checklist"
export type CorrectionField = "sellerType" | "legalName" | "uen" | "licenceNo" | "species" | "internalNote"

function sellerPath(sellerId: string) {
	return `/admin/sellers/${sellerId}`
}

/** Approve, reject, suspend or reinstate. Bound to the seller id in the decision panel. */
export async function reviewSeller(
	sellerId: string,
	_prev: ActionState<ReviewField>,
	formData: FormData
): Promise<ActionState<ReviewField>> {
	await requireAdmin(sellerPath(sellerId))
	const values = valuesFrom(formData, ["message", "internalNote"] as const)
	const parsed = reviewSchema.safeParse({
		decision: formData.get("decision"),
		message: formData.get("message") ?? "",
		internalNote: formData.get("internalNote") ?? "",
		checklist: formData.getAll("checklist"),
	})
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const { decision, message, internalNote, checklist } = parsed.data
	const supabase = await createClient()
	const { error } = await supabase.rpc("review_seller", {
		p_seller_id: sellerId,
		p_decision: decision,
		p_message: message ?? undefined,
		p_internal_note: internalNote ?? undefined,
		p_checklist: checklist,
	})
	if (error) {
		return { formError: adminErrorMessage(error), values }
	}

	revalidatePath("/", "layout")
	redirect(sellerPath(sellerId))
}

/** Changes locked seller details, with a note for the audit trail. */
export async function correctSellerDetails(
	sellerId: string,
	_prev: ActionState<CorrectionField>,
	formData: FormData
): Promise<ActionState<CorrectionField>> {
	await requireAdmin(sellerPath(sellerId))
	const values = valuesFrom(formData, ["sellerType", "legalName", "uen", "licenceNo", "internalNote"] as const)
	const parsed = correctionSchema.safeParse({ ...values, species: formData.getAll("species") })
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const { sellerType, legalName, uen, licenceNo, species, internalNote } = parsed.data
	const supabase = await createClient()
	const { error } = await supabase.rpc("admin_correct_seller", {
		p_seller_id: sellerId,
		p_seller_type: sellerType,
		p_legal_name: legalName,
		p_uen: uen,
		p_licence_no: licenceNo,
		p_species: species,
		p_internal_note: internalNote,
	})
	if (error) {
		return {
			formError: error.code === "23505" ? "Another seller already uses this UEN." : adminErrorMessage(error),
			values,
		}
	}

	revalidatePath("/", "layout")
	redirect(sellerPath(sellerId))
}
