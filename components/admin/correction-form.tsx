"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SelectField } from "@/components/forms/select-field"
import { SubmitButton } from "@/components/forms/submit-button"
import { TextareaField } from "@/components/forms/textarea-field"
import { correctSellerDetails } from "@/lib/admin/actions"
import type { CurrentSeller, Species } from "@/lib/sellers/queries"
import { sellerTypes } from "@/lib/sellers/schema"
import { sellerTypeLabels } from "@/lib/sellers/status"
import { useActionState } from "react"

/** Lets an admin change the details sellers can't, with a note for the audit trail. */
export function CorrectionForm({ seller, species }: { seller: CurrentSeller; species: Species[] }) {
	const [state, action, pending] = useActionState(correctSellerDetails.bind(null, seller.id), {})
	const values = state.values ?? {}
	const errors = state.fieldErrors ?? {}
	const current = seller.species.map((s) => s.slug)

	return (
		<form action={action} className="grid gap-4">
			<FormAlert message={state.formError} />
			<SelectField
				name="sellerType"
				label="Seller type"
				defaultValue={values.sellerType ?? seller.sellerType}
				error={errors.sellerType}
			>
				{sellerTypes.map((type) => (
					<option key={type} value={type}>
						{sellerTypeLabels[type]}
					</option>
				))}
			</SelectField>
			<Field
				name="legalName"
				label="Registered name"
				defaultValue={values.legalName ?? seller.legalName ?? ""}
				error={errors.legalName}
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				<Field name="uen" label="UEN" defaultValue={values.uen ?? seller.uen ?? ""} error={errors.uen} />
				<Field
					name="licenceNo"
					label="AVS licence number"
					defaultValue={values.licenceNo ?? seller.licenceNo ?? ""}
					error={errors.licenceNo}
				/>
			</div>
			<fieldset>
				<legend className="text-sm font-medium">Licensed for</legend>
				<div className="mt-2 flex flex-wrap gap-4">
					{species
						.filter((s) => s.isActive)
						.map((s) => (
							<label key={s.slug} className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									name="species"
									value={s.slug}
									defaultChecked={current.includes(s.slug)}
									className="accent-foreground size-4"
								/>
								{s.name}
							</label>
						))}
				</div>
				{errors.species && <p className="text-destructive mt-2 text-sm">{errors.species}</p>}
			</fieldset>
			<TextareaField
				name="internalNote"
				label="Reason for the correction"
				hint="Required. Only admins see this."
				rows={2}
				maxLength={2000}
				defaultValue={values.internalNote}
				error={errors.internalNote}
			/>
			<div className="sm:w-56">
				<SubmitButton pending={pending}>Save correction</SubmitButton>
			</div>
		</form>
	)
}
