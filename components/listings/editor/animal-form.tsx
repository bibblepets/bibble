"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SelectField } from "@/components/forms/select-field"
import { formatDate } from "@/lib/dates"
import { saveAnimal } from "@/lib/listings/actions"
import type { Breed, ListingForEdit } from "@/lib/listings/queries"
import { earliestHandover } from "@/lib/listings/rules"
import { useActionState, useState } from "react"
import { SaveRow } from "./save-row"

type AnimalFormProps = { listing: ListingForEdit; breeds: Breed[]; editable: boolean }

function breedLabel(breed: Breed): string {
	if (breed.specifiedPart === 1) return `${breed.name} (can't be sold in Singapore)`
	if (breed.specifiedPart === 2) return `${breed.name} (Specified Dog, conditions apply)`
	return breed.name
}

function BreedOptions({ breeds }: { breeds: Breed[] }) {
	return breeds.map((breed) => (
		<option key={breed.id} value={breed.id} disabled={breed.specifiedPart === 1}>
			{breedLabel(breed)}
		</option>
	))
}

export function AnimalForm({ listing, breeds, editable }: AnimalFormProps) {
	const [state, action, pending] = useActionState(saveAnimal.bind(null, listing.id), {})
	const values = state.values ?? {}
	const errors = state.fieldErrors ?? {}
	const [dateOfBirth, setDateOfBirth] = useState(values.dateOfBirth ?? listing.dateOfBirth ?? "")
	const earliest = /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ? earliestHandover(dateOfBirth) : null

	return (
		<form action={action} className="grid gap-5" noValidate>
			<fieldset disabled={!editable} className="grid gap-5">
				<FormAlert message={state.formError} />
				<div className="grid gap-5 sm:grid-cols-2">
					<SelectField
						name="breedId"
						label="Breed"
						defaultValue={values.breedId ?? String(listing.breed?.id ?? "")}
						error={errors.breedId}
					>
						<option value="">Choose a breed</option>
						<BreedOptions breeds={breeds} />
					</SelectField>
					<SelectField
						name="crossBreedId"
						label="Crossed with (optional)"
						hint="For crosses like a Cavapoo (Cavalier King Charles Spaniel × Poodle)."
						defaultValue={values.crossBreedId ?? String(listing.crossBreed?.id ?? "")}
						error={errors.crossBreedId}
					>
						<option value="">Not a cross</option>
						<BreedOptions breeds={breeds} />
					</SelectField>
					<SelectField name="sex" label="Sex" defaultValue={values.sex ?? listing.sex ?? ""} error={errors.sex}>
						<option value="">Choose</option>
						<option value="male">Male</option>
						<option value="female">Female</option>
					</SelectField>
					<Field
						name="colour"
						label="Colour"
						maxLength={40}
						defaultValue={values.colour ?? listing.colour ?? ""}
						error={errors.colour}
					/>
					<Field
						name="dateOfBirth"
						label="Date of birth"
						type="date"
						defaultValue={values.dateOfBirth ?? listing.dateOfBirth ?? ""}
						onChange={(event) => setDateOfBirth(event.target.value)}
						error={errors.dateOfBirth}
					/>
					<Field
						name="readyDate"
						label="Ready to go home"
						type="date"
						hint={
							earliest
								? `Puppies can go home at 9 weeks: ${formatDate(earliest)} at the earliest.`
								: "Puppies can go home at 9 weeks or older."
						}
						defaultValue={values.readyDate ?? listing.readyDate ?? ""}
						error={errors.readyDate}
					/>
					<Field
						name="weightKg"
						label="Weight in kg (optional)"
						inputMode="decimal"
						defaultValue={values.weightKg ?? listing.weightKg?.toString() ?? ""}
						error={errors.weightKg}
					/>
					<Field
						name="heightCm"
						label="Height in cm (optional)"
						inputMode="decimal"
						defaultValue={values.heightCm ?? listing.heightCm?.toString() ?? ""}
						error={errors.heightCm}
					/>
				</div>
				<label className="flex items-center gap-3 text-sm font-medium">
					<input
						type="checkbox"
						name="sterilised"
						defaultChecked={values.sterilised ? values.sterilised === "on" : listing.sterilised}
						className="accent-foreground size-4"
					/>
					Sterilised
				</label>
			</fieldset>
			<SaveRow pending={pending} saved={state.saved} editable={editable} />
		</form>
	)
}
