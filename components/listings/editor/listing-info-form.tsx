"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { TextareaField } from "@/components/forms/textarea-field"
import { saveListingInfo } from "@/lib/listings/actions"
import type { ListingForEdit } from "@/lib/listings/queries"
import { useActionState } from "react"
import { SaveRow } from "./save-row"

export function ListingInfoForm({ listing, editable }: { listing: ListingForEdit; editable: boolean }) {
	const [state, action, pending] = useActionState(saveListingInfo.bind(null, listing.id), {})
	const values = state.values ?? {}
	const errors = state.fieldErrors ?? {}
	const price = listing.priceCents === null ? "" : String(listing.priceCents / 100)

	return (
		<form action={action} className="grid gap-5" noValidate>
			<fieldset disabled={!editable} className="grid gap-5">
				<FormAlert message={state.formError} />
				<Field
					name="title"
					label="Title"
					hint="Short and specific, e.g. “Cavapoo girl, family-raised”."
					maxLength={80}
					defaultValue={values.title ?? listing.title ?? ""}
					error={errors.title}
				/>
				<div className="sm:w-60">
					<Field
						name="priceCents"
						label="Price (SGD)"
						inputMode="decimal"
						hint="The full price in dollars."
						defaultValue={values.priceCents ?? price}
						error={errors.priceCents}
					/>
				</div>
				<TextareaField
					name="description"
					label="Description (optional)"
					hint="Temperament, how they've been raised, what comes with them. Don't include phone numbers or links."
					rows={6}
					maxLength={2000}
					defaultValue={values.description ?? listing.description ?? ""}
					error={errors.description}
				/>
			</fieldset>
			<SaveRow pending={pending} saved={state.saved} editable={editable} />
		</form>
	)
}
