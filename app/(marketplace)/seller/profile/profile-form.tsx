"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SubmitButton } from "@/components/forms/submit-button"
import { LocationFields } from "@/components/seller/location-fields"
import { updateSellerProfile } from "@/lib/sellers/actions"
import type { CurrentSeller, PlanningArea } from "@/lib/sellers/queries"
import { useActionState } from "react"

export function ProfileForm({ seller, planningAreas }: { seller: CurrentSeller; planningAreas: PlanningArea[] }) {
	const [state, action, pending] = useActionState(updateSellerProfile, {})
	const errors = state.fieldErrors ?? {}

	return (
		<form action={action} className="grid gap-6" noValidate>
			<FormAlert message={state.formError} />
			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					name="displayName"
					label="Trading name"
					hint="The name buyers see on your listings."
					required
					maxLength={80}
					defaultValue={state.values?.displayName ?? seller.displayName ?? ""}
					error={errors.displayName}
				/>
				<Field
					name="licenceExpiresOn"
					label="Licence expiry date"
					hint="Update this when you renew with AVS."
					type="date"
					required
					defaultValue={state.values?.licenceExpiresOn ?? seller.licenceExpiresOn ?? ""}
					error={errors.licenceExpiresOn}
				/>
			</div>
			<LocationFields seller={seller} planningAreas={planningAreas} values={state.values} errors={errors} />
			<div className="sm:w-60">
				<SubmitButton pending={pending}>Save changes</SubmitButton>
			</div>
		</form>
	)
}
