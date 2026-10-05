"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { saveSource } from "@/lib/listings/actions"
import type { ListingForEdit } from "@/lib/listings/queries"
import type { SellerType } from "@/lib/sellers/schema"
import { useActionState, useState } from "react"
import { SaveRow } from "./save-row"

const optionClassName =
	"has-[:checked]:border-foreground has-[:checked]:ring-foreground flex cursor-pointer gap-3 rounded-xl border p-4 has-[:checked]:ring-1"

type SourceFormProps = { listing: ListingForEdit; sellerType: SellerType; editable: boolean }

/** Where the animal comes from. Breeders sell only animals they bred; pet shops buy from breeders or import. */
export function SourceForm({ listing, sellerType, editable }: SourceFormProps) {
	const [state, action, pending] = useActionState(saveSource.bind(null, listing.id), {})
	const values = state.values ?? {}
	const errors = state.fieldErrors ?? {}
	const [source, setSource] = useState(values.source ?? listing.source ?? "")

	if (sellerType === "breeder") {
		return <p>Bred on your licensed premises. As a breeder, you can only list animals you&apos;ve bred yourself.</p>
	}

	return (
		<form action={action} className="grid gap-5" noValidate>
			<fieldset disabled={!editable} className="grid gap-5">
				<FormAlert message={state.formError} />
				<div role="radiogroup" aria-label="Source" className="grid gap-3 sm:grid-cols-2">
					{[
						["licensed_breeder", "From a licensed breeder", "A local breeder licensed by AVS."],
						["imported", "Imported", "Brought in with an AVS import permit."],
					].map(([value, title, description]) => (
						<label key={value} className={optionClassName}>
							<input
								type="radio"
								name="source"
								value={value}
								checked={source === value}
								onChange={() => setSource(value)}
								className="accent-foreground mt-1"
							/>
							<span>
								<span className="block font-medium">{title}</span>
								<span className="text-muted-foreground block text-sm">{description}</span>
							</span>
						</label>
					))}
				</div>
				{errors.source && <p className="text-destructive text-sm">{errors.source}</p>}
				{source === "licensed_breeder" && (
					<div className="sm:w-80">
						<Field
							name="sourceLicenceNo"
							label="Breeder's AVS licence number"
							hint="For example BR25008."
							defaultValue={values.sourceLicenceNo ?? listing.sourceLicenceNo ?? ""}
							error={errors.sourceLicenceNo}
						/>
					</div>
				)}
				{source === "imported" && (
					<div className="grid gap-5 sm:grid-cols-2">
						<Field
							name="importPermitNo"
							label="Import permit number"
							maxLength={40}
							defaultValue={values.importPermitNo ?? listing.importPermitNo ?? ""}
							error={errors.importPermitNo}
						/>
						<Field
							name="arrivalDate"
							label="Arrival date"
							type="date"
							hint="Imported animals can go home 72 hours after arrival at the earliest."
							defaultValue={values.arrivalDate ?? listing.arrivalDate ?? ""}
							error={errors.arrivalDate}
						/>
					</div>
				)}
			</fieldset>
			<SaveRow pending={pending} saved={state.saved} editable={editable} />
		</form>
	)
}
