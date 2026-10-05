"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { WizardFooter } from "@/components/seller/wizard-footer"
import { saveBusinessStep, type BusinessField } from "@/lib/sellers/actions"
import { useActionState } from "react"

type BusinessFormProps = {
	licenceLabel: string
	licenceExample: string
	defaults: Record<BusinessField, string>
}

export function BusinessForm({ licenceLabel, licenceExample, defaults }: BusinessFormProps) {
	const [state, action, pending] = useActionState(saveBusinessStep, {})
	const values = { ...defaults, ...state.values }
	const errors = state.fieldErrors ?? {}

	return (
		<form id="wizard-step" action={action} className="grid gap-6" noValidate>
			<FormAlert message={state.formError} />
			<Field
				name="displayName"
				label="Trading name"
				hint="The name buyers see on your listings."
				required
				maxLength={80}
				defaultValue={values.displayName}
				error={errors.displayName}
			/>
			<Field
				name="legalName"
				label="Registered business name"
				hint="As shown on your ACRA BizFile."
				required
				maxLength={160}
				autoComplete="organization"
				defaultValue={values.legalName}
				error={errors.legalName}
			/>
			<Field
				name="uen"
				label="UEN"
				hint="Your Unique Entity Number, e.g. 202301234K."
				required
				autoCapitalize="characters"
				spellCheck={false}
				defaultValue={values.uen}
				error={errors.uen}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					name="licenceNo"
					label={licenceLabel}
					hint={`For example ${licenceExample}.`}
					required
					autoCapitalize="characters"
					spellCheck={false}
					defaultValue={values.licenceNo}
					error={errors.licenceNo}
				/>
				<Field
					name="licenceExpiresOn"
					label="Licence expiry date"
					type="date"
					required
					defaultValue={values.licenceExpiresOn}
					error={errors.licenceExpiresOn}
				/>
			</div>
			<WizardFooter step="business" next={{ kind: "submit", formId: "wizard-step", pending }} />
		</form>
	)
}
