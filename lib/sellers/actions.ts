"use server"

import { requireUser } from "@/lib/auth/session"
import { fieldErrorsFrom, valuesFrom, type ActionState } from "@/lib/forms"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { documentFileError, SELLER_DOCUMENTS_BUCKET } from "./documents"
import { isDuplicateUen, sellerErrorMessage } from "./errors"
import { documentKinds, isEditableInWizard, type DocumentKind, type WizardStep } from "./progress"
import { getCurrentSeller, listSpecies, requireSeller, type CurrentSeller } from "./queries"
import { businessStepSchema, locationStepSchema, profileSchema, typeStepSchema } from "./schema"

export type TypeField = "sellerType" | "species"
export type BusinessField = "displayName" | "legalName" | "uen" | "licenceNo" | "licenceExpiresOn"
export type LocationField =
	"addressLine1" | "addressLine2" | "postalCode" | "areaId" | "contactPhone" | "contactEmail" | "about"
export type ProfileField = LocationField | "displayName" | "licenceExpiresOn"

const DUPLICATE_UEN = "This UEN is already registered on Bibble. Contact us if you think that's a mistake."

/** "Save & exit" submits the step with intent=exit and returns to the dashboard instead of the next step. */
function nextPath(formData: FormData, next: WizardStep): string {
	return formData.get("intent") === "exit" ? "/seller" : `/seller/onboarding/${next}`
}

/** The current seller, if they may still edit through the wizard; otherwise back to the dashboard. */
async function requireEditableSeller(returnTo: string): Promise<CurrentSeller> {
	const seller = await requireSeller(returnTo)
	if (!isEditableInWizard(seller.status)) {
		redirect("/seller")
	}
	return seller
}

export async function saveTypeStep(_prev: ActionState<TypeField>, formData: FormData): Promise<ActionState<TypeField>> {
	await requireUser("/seller/onboarding/type")
	const parsed = typeStepSchema.safeParse({
		sellerType: formData.get("sellerType"),
		species: formData.getAll("species"),
	})
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values: valuesFrom(formData, ["sellerType"] as const) }
	}

	const { sellerType, species } = parsed.data
	const supabase = await createClient()
	const seller = await getCurrentSeller()

	if (!seller) {
		const { error } = await supabase.rpc("create_seller", { p_seller_type: sellerType, p_species: species })
		if (error) {
			return { formError: sellerErrorMessage(error) }
		}
	} else {
		if (!isEditableInWizard(seller.status)) {
			redirect("/seller")
		}
		const activeSpecies = (await listSpecies()).filter((s) => s.isActive && species.includes(s.slug))
		if (activeSpecies.length !== species.length) {
			return { fieldErrors: { species: sellerErrorMessage({ message: "invalid_species" }) } }
		}

		// Licence formats differ by type, so a type change means re-entering the licence number.
		const typeChanged = sellerType !== seller.sellerType
		const { error: updateError } = await supabase
			.from("sellers")
			.update(typeChanged ? { seller_type: sellerType, licence_no: null } : { seller_type: sellerType })
			.eq("id", seller.id)
		const ids = activeSpecies.map((s) => s.id)
		const { error: removeError } = await supabase
			.from("seller_species")
			.delete()
			.eq("seller_id", seller.id)
			.not("species_id", "in", `(${ids.join(",")})`)
		const { error: addError } = await supabase.from("seller_species").upsert(
			ids.map((id) => ({ seller_id: seller.id, species_id: id })),
			{ onConflict: "seller_id,species_id", ignoreDuplicates: true }
		)
		const error = updateError ?? removeError ?? addError
		if (error) {
			return { formError: sellerErrorMessage(error) }
		}
	}

	revalidatePath("/", "layout")
	redirect(nextPath(formData, "business"))
}

export async function saveBusinessStep(
	_prev: ActionState<BusinessField>,
	formData: FormData
): Promise<ActionState<BusinessField>> {
	const seller = await requireEditableSeller("/seller/onboarding/business")
	const values = valuesFrom(formData, ["displayName", "legalName", "uen", "licenceNo", "licenceExpiresOn"] as const)
	const parsed = businessStepSchema(seller.sellerType).safeParse(values)
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const supabase = await createClient()
	const { displayName, legalName, uen, licenceNo, licenceExpiresOn } = parsed.data
	const { error } = await supabase
		.from("sellers")
		.update({
			display_name: displayName,
			legal_name: legalName,
			uen,
			licence_no: licenceNo,
			licence_expires_on: licenceExpiresOn,
		})
		.eq("id", seller.id)
	if (isDuplicateUen(error)) {
		return { fieldErrors: { uen: DUPLICATE_UEN }, values }
	}
	if (error) {
		return { formError: sellerErrorMessage(error), values }
	}

	revalidatePath("/seller", "layout")
	redirect(nextPath(formData, "location"))
}

const locationFields = [
	"addressLine1",
	"addressLine2",
	"postalCode",
	"areaId",
	"contactPhone",
	"contactEmail",
	"about",
] as const

/** Writes the location step's fields, which the profile page edits too. */
async function saveLocation(
	sellerId: string,
	data: ReturnType<typeof locationStepSchema.parse>,
	extra: { display_name?: string; licence_expires_on?: string } = {}
) {
	const supabase = await createClient()
	const { error: sellerError } = await supabase
		.from("sellers")
		.update({ area_id: data.areaId, about: data.about, ...extra })
		.eq("id", sellerId)
	const { error: detailsError } = await supabase
		.from("seller_private_details")
		.update({
			address_line1: data.addressLine1,
			address_line2: data.addressLine2,
			postal_code: data.postalCode,
			contact_phone: data.contactPhone,
			contact_email: data.contactEmail,
		})
		.eq("seller_id", sellerId)
	return sellerError ?? detailsError
}

export async function saveLocationStep(
	_prev: ActionState<LocationField>,
	formData: FormData
): Promise<ActionState<LocationField>> {
	const seller = await requireEditableSeller("/seller/onboarding/location")
	const values = valuesFrom(formData, locationFields)
	const parsed = locationStepSchema.safeParse(values)
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const error = await saveLocation(seller.id, parsed.data)
	if (error) {
		return { formError: sellerErrorMessage(error), values }
	}

	revalidatePath("/seller", "layout")
	redirect(nextPath(formData, "documents"))
}

/**
 * Records a document the browser has already uploaded to Storage. Size and type are read back from Storage
 * rather than trusted from the client.
 */
export async function recordSellerDocument(input: {
	kind: DocumentKind
	storagePath: string
	fileName: string
}): Promise<{ error?: string }> {
	const seller = await requireEditableSeller("/seller/onboarding/documents")
	const { kind, storagePath, fileName } = input

	const objectName = storagePath.slice(seller.id.length + 1)
	if (
		!documentKinds.includes(kind) ||
		!storagePath.startsWith(`${seller.id}/`) ||
		!/^[\w-]+\.(pdf|jpe?g|png)$/i.test(objectName) ||
		!fileName.trim()
	) {
		return { error: "That upload doesn't look right. Please try again." }
	}

	const supabase = await createClient()
	const { data: info, error: infoError } = await supabase.storage.from(SELLER_DOCUMENTS_BUCKET).info(storagePath)
	if (infoError || !info) {
		return { error: "We couldn't find your upload. Please try again." }
	}
	const fileError = documentFileError({ type: info.contentType ?? "", size: info.size ?? 0 })
	if (fileError) {
		return { error: fileError }
	}

	const user = await requireUser("/seller/onboarding/documents")
	const { error } = await supabase.from("seller_documents").insert({
		seller_id: seller.id,
		kind,
		storage_path: storagePath,
		file_name: fileName.trim().slice(0, 255),
		content_type: info.contentType!,
		size_bytes: info.size!,
		uploaded_by: user.id,
	})
	if (error) {
		return { error: sellerErrorMessage(error) }
	}

	revalidatePath("/seller", "layout")
	return {}
}

export async function submitForVerification(): Promise<ActionState> {
	const seller = await requireEditableSeller("/seller/onboarding/review")
	const supabase = await createClient()
	const { error } = await supabase.rpc("submit_seller_for_verification", { p_seller_id: seller.id })
	if (error) {
		return { formError: sellerErrorMessage(error) }
	}

	revalidatePath("/", "layout")
	redirect("/seller")
}

export async function updateSellerProfile(
	_prev: ActionState<ProfileField>,
	formData: FormData
): Promise<ActionState<ProfileField>> {
	const seller = await requireSeller("/seller/profile")
	if (seller.status === "incomplete") {
		redirect("/seller/onboarding")
	}

	const values = valuesFrom(formData, [...locationFields, "displayName", "licenceExpiresOn"] as const)
	const parsed = profileSchema().safeParse(values)
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const error = await saveLocation(seller.id, parsed.data, {
		display_name: parsed.data.displayName,
		licence_expires_on: parsed.data.licenceExpiresOn,
	})
	if (error) {
		return { formError: sellerErrorMessage(error), values }
	}

	revalidatePath("/", "layout")
	redirect("/seller")
}
