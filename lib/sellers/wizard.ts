import "server-only"

import { requireUser } from "@/lib/auth/session"
import { redirect } from "next/navigation"
import { canOpenStep, isEditableInWizard, resumeStep, type WizardStep } from "./progress"
import { getCurrentSeller, type CurrentSeller } from "./queries"

export function stepPath(step: WizardStep): string {
	return `/seller/onboarding/${step}`
}

/**
 * Guards a wizard step page. Signed-out users go to log in; submitted sellers go to the dashboard; sellers who
 * skip ahead go back to their first unfinished step. Returns the seller (null only on the first step).
 */
export async function loadWizardStep(step: WizardStep): Promise<CurrentSeller | null> {
	await requireUser(stepPath(step))
	const seller = await getCurrentSeller()

	if (seller && !isEditableInWizard(seller.status)) {
		redirect("/seller")
	}
	if (!canOpenStep(seller, step)) {
		redirect(stepPath(resumeStep(seller)))
	}
	return seller
}

/** Like loadWizardStep, for steps that need the seller to exist already. */
export async function loadExistingSellerStep(step: Exclude<WizardStep, "type">): Promise<CurrentSeller> {
	const seller = await loadWizardStep(step)
	// canOpenStep never lets a missing seller past the type step.
	return seller!
}
