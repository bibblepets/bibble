"use client"

import { FormAlert } from "@/components/forms/form-alert"
import { saveLocationStep } from "@/lib/sellers/actions"
import type { CurrentSeller, PlanningArea } from "@/lib/sellers/queries"
import { useActionState } from "react"
import { LocationFields } from "./location-fields"
import { WizardFooter } from "./wizard-footer"

export function LocationForm({ seller, planningAreas }: { seller: CurrentSeller; planningAreas: PlanningArea[] }) {
	const [state, action, pending] = useActionState(saveLocationStep, {})

	return (
		<form id="wizard-step" action={action} className="grid gap-6" noValidate>
			<FormAlert message={state.formError} />
			<LocationFields seller={seller} planningAreas={planningAreas} values={state.values} errors={state.fieldErrors} />
			<WizardFooter step="location" next={{ kind: "submit", formId: "wizard-step", pending }} />
		</form>
	)
}
