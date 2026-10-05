import type { SellerType } from "./schema"

export const sellerStatuses = ["incomplete", "pending", "verified", "rejected", "suspended"] as const
export type SellerStatus = (typeof sellerStatuses)[number]

export const documentKinds = ["avs_licence", "acra_bizfile"] as const
export type DocumentKind = (typeof documentKinds)[number]

export const wizardSteps = ["type", "business", "location", "documents", "review"] as const
export type WizardStep = (typeof wizardSteps)[number]

/** The parts of a seller the wizard needs to work out which steps are done. */
export type SellerProgressInput = {
	status: SellerStatus
	sellerType: SellerType
	speciesCount: number
	displayName: string | null
	legalName: string | null
	uen: string | null
	licenceNo: string | null
	licenceExpiresOn: string | null
	areaId: number | null
	addressLine1: string | null
	postalCode: string | null
	contactPhone: string | null
	contactEmail: string | null
	documentKinds: readonly DocumentKind[]
}

const stepDone: Record<Exclude<WizardStep, "review">, (seller: SellerProgressInput) => boolean> = {
	type: (s) => s.speciesCount > 0,
	business: (s) => Boolean(s.displayName && s.legalName && s.uen && s.licenceNo && s.licenceExpiresOn),
	location: (s) => Boolean(s.areaId && s.addressLine1 && s.postalCode && s.contactPhone && s.contactEmail),
	documents: (s) => documentKinds.every((kind) => s.documentKinds.includes(kind)),
}

/** Wizard steps that are complete. Review counts as done once everything before it is. */
export function completedSteps(seller: SellerProgressInput | null): Set<WizardStep> {
	const done = new Set<WizardStep>()
	if (!seller) {
		return done
	}
	for (const step of wizardSteps) {
		if (step === "review" ? done.size === wizardSteps.length - 1 : stepDone[step](seller)) {
			done.add(step)
		}
	}
	return done
}

/** The step to resume at: the first unfinished one, or review when everything is filled in. */
export function resumeStep(seller: SellerProgressInput | null): WizardStep {
	const done = completedSteps(seller)
	return wizardSteps.find((step) => !done.has(step)) ?? "review"
}

/** Whether `step` may be opened: every step before it must be complete. */
export function canOpenStep(seller: SellerProgressInput | null, step: WizardStep): boolean {
	const done = completedSteps(seller)
	return wizardSteps.slice(0, wizardSteps.indexOf(step)).every((earlier) => done.has(earlier))
}

/** Sellers can only use the wizard before submitting, or to fix things after a rejection. */
export function isEditableInWizard(status: SellerStatus): boolean {
	return status === "incomplete" || status === "rejected"
}

/** Steps still to do before the seller can submit, for the dashboard checklist. */
export function remainingStepCount(seller: SellerProgressInput): number {
	const done = completedSteps(seller)
	return wizardSteps.filter((step) => step !== "review" && !done.has(step)).length
}
