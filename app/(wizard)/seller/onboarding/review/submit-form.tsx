"use client"

import { FormAlert } from "@/components/forms/form-alert"
import { WizardFooter } from "@/components/seller/wizard-footer"
import { submitForVerification } from "@/lib/sellers/actions"
import { useActionState } from "react"

export function SubmitForm() {
	const [state, action, pending] = useActionState(submitForVerification, {})

	return (
		<form id="wizard-step" action={action} className="mt-6">
			<FormAlert message={state.formError} />
			<WizardFooter
				step="review"
				nextLabel="Submit for verification"
				next={{ kind: "submit", formId: "wizard-step", pending }}
			/>
		</form>
	)
}
