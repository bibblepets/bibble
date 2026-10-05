"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SelectField } from "@/components/forms/select-field"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/dates"
import { addHealthRecord, removeHealthRecord, saveMicrochip } from "@/lib/listings/actions"
import type { HealthRecord, ListingForEdit } from "@/lib/listings/queries"
import { useActionState, useState, useTransition } from "react"
import { SaveRow } from "./save-row"

const kindLabels = { vaccination: "Vaccination", deworming: "Deworming" } as const

function MicrochipForm({ listing, editable }: { listing: ListingForEdit; editable: boolean }) {
	const [state, action, pending] = useActionState(saveMicrochip.bind(null, listing.id), {})

	return (
		<form action={action} className="grid gap-4" noValidate>
			<fieldset disabled={!editable} className="grid gap-4 sm:w-80">
				<FormAlert message={state.formError} />
				<Field
					name="microchipNo"
					label="Microchip number"
					hint="15 digits. Only Bibble's verification team sees this."
					inputMode="numeric"
					defaultValue={state.values?.microchipNo ?? listing.microchipNo ?? ""}
					error={state.fieldErrors?.microchipNo}
				/>
			</fieldset>
			<SaveRow pending={pending} saved={state.saved} editable={editable} label="Save microchip" />
		</form>
	)
}

function RecordRow({ listingId, record, editable }: { listingId: string; record: HealthRecord; editable: boolean }) {
	const [pending, startTransition] = useTransition()
	const [error, setError] = useState<string | null>(null)
	const label = `${kindLabels[record.kind]} on ${formatDate(record.givenOn)}`

	return (
		<li className="flex flex-wrap items-center justify-between gap-3 py-3">
			<div>
				<p className="font-medium">{label}</p>
				<p className="text-muted-foreground text-sm">
					{record.product}
					{record.clinic && ` · ${record.clinic}`}
				</p>
				{error && (
					<p role="alert" className="text-destructive text-sm">
						{error}
					</p>
				)}
			</div>
			{editable && (
				<Button
					type="button"
					variant="ghost"
					disabled={pending}
					aria-label={`Remove ${label.toLowerCase()}`}
					onClick={() =>
						startTransition(async () => {
							const result = await removeHealthRecord(listingId, record.id)
							setError(result.error ?? null)
						})
					}
				>
					Remove
				</Button>
			)}
		</li>
	)
}

function AddRecordForm({ listingId }: { listingId: string }) {
	const [state, action, pending] = useActionState(addHealthRecord.bind(null, listingId), {})
	const values = state.saved ? {} : (state.values ?? {})
	const errors = state.fieldErrors ?? {}

	return (
		// React resets the form after each action; empty defaults once saved leave it ready for the next record.
		<form action={action} className="bg-muted/40 grid gap-4 rounded-xl p-4" noValidate>
			<h3 className="font-semibold">Add a record</h3>
			<FormAlert message={state.formError} />
			<div className="grid gap-4 sm:grid-cols-2">
				<SelectField name="kind" label="Type" defaultValue={values.kind ?? "vaccination"} error={errors.kind}>
					<option value="vaccination">Vaccination</option>
					<option value="deworming">Deworming</option>
				</SelectField>
				<Field name="givenOn" label="Date given" type="date" defaultValue={values.givenOn} error={errors.givenOn} />
				<Field
					name="product"
					label="Vaccine or dewormer"
					hint="As written on the vaccination card, e.g. Nobivac DHPPi."
					maxLength={80}
					defaultValue={values.product}
					error={errors.product}
				/>
				<Field
					name="clinic"
					label="Clinic (optional)"
					maxLength={120}
					defaultValue={values.clinic}
					error={errors.clinic}
				/>
			</div>
			<SaveRow pending={pending} editable label="Add record" />
		</form>
	)
}

/** Microchip, vaccinations and dewormings. */
export function HealthSection({ listing, editable }: { listing: ListingForEdit; editable: boolean }) {
	return (
		<div className="grid gap-8">
			<MicrochipForm listing={listing} editable={editable} />
			<div>
				<h3 className="font-semibold">Vaccinations and dewormings</h3>
				<p className="text-muted-foreground mt-1 text-sm">
					At least 2 vaccinations, the last one at least 7 days before the ready date, and at least 2 dewormings. Buyers
					see these on your listing.
				</p>
				{listing.healthRecords.length === 0 ? (
					<p className="text-muted-foreground mt-4 text-sm">No records yet.</p>
				) : (
					<ul className="mt-2 divide-y" aria-label="Health records">
						{listing.healthRecords.map((record) => (
							<RecordRow key={record.id} listingId={listing.id} record={record} editable={editable} />
						))}
					</ul>
				)}
			</div>
			{editable && <AddRecordForm listingId={listing.id} />}
		</div>
	)
}
