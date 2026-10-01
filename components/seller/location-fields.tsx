"use client"

import { Field } from "@/components/forms/field"
import { SelectField } from "@/components/forms/select-field"
import { TextareaField } from "@/components/forms/textarea-field"
import type { LocationField } from "@/lib/sellers/actions"
import type { CurrentSeller, PlanningArea } from "@/lib/sellers/queries"
import { formatLocation, regionLabels } from "@/lib/sellers/status"
import { MapPinIcon } from "lucide-react"
import { useState } from "react"

type LocationFieldsProps = {
	seller: CurrentSeller
	planningAreas: PlanningArea[]
	values?: Partial<Record<LocationField, string>>
	errors?: Partial<Record<LocationField, string>>
}

/** Address, public area and contact fields, shared by the wizard and the profile page. */
export function LocationFields({ seller, planningAreas, values = {}, errors = {} }: LocationFieldsProps) {
	const [areaId, setAreaId] = useState(values.planningAreaId ?? String(seller.planningAreaId ?? ""))
	const area = planningAreas.find((a) => String(a.id) === areaId) ?? null
	const regions = Object.keys(regionLabels).filter((region) => planningAreas.some((a) => a.region === region))

	return (
		<div className="grid gap-6">
			<Field
				name="addressLine1"
				label="Address"
				autoComplete="address-line1"
				required
				maxLength={120}
				defaultValue={values.addressLine1 ?? seller.addressLine1 ?? ""}
				error={errors.addressLine1}
			/>
			<Field
				name="addressLine2"
				label="Unit or building (optional)"
				autoComplete="address-line2"
				maxLength={120}
				defaultValue={values.addressLine2 ?? seller.addressLine2 ?? ""}
				error={errors.addressLine2}
			/>
			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					name="postalCode"
					label="Postal code"
					autoComplete="postal-code"
					inputMode="numeric"
					maxLength={6}
					required
					defaultValue={values.postalCode ?? seller.postalCode ?? ""}
					error={errors.postalCode}
				/>
				<SelectField
					name="planningAreaId"
					label="Area"
					required
					value={areaId}
					onChange={(event) => setAreaId(event.target.value)}
					error={errors.planningAreaId}
				>
					<option value="">Choose an area</option>
					{regions.map((region) => (
						<optgroup key={region} label={regionLabels[region]}>
							{planningAreas
								.filter((a) => a.region === region)
								.map((a) => (
									<option key={a.id} value={a.id}>
										{a.name}
									</option>
								))}
						</optgroup>
					))}
				</SelectField>
			</div>
			<p className="bg-muted flex items-center gap-2 rounded-lg px-4 py-3 text-sm" aria-live="polite">
				<MapPinIcon className="size-4 shrink-0" aria-hidden />
				{area ? (
					<span>
						Buyers will see: <strong>{formatLocation(area)}</strong>
					</span>
				) : (
					<span>Choose an area to see what buyers will see.</span>
				)}
			</p>

			<div className="grid gap-6 sm:grid-cols-2">
				<Field
					name="contactPhone"
					label="Phone"
					type="tel"
					autoComplete="tel"
					hint="For Bibble to contact you. Not shown to buyers."
					required
					defaultValue={values.contactPhone ?? seller.contactPhone?.replace(/^\+65/, "") ?? ""}
					error={errors.contactPhone}
				/>
				<Field
					name="contactEmail"
					label="Email"
					type="email"
					autoComplete="email"
					hint="For Bibble to contact you. Not shown to buyers."
					required
					defaultValue={values.contactEmail ?? seller.contactEmail ?? ""}
					error={errors.contactEmail}
				/>
			</div>
			<TextareaField
				name="about"
				label="About your business (optional)"
				hint="Shown on your public profile. Up to 1,000 characters."
				maxLength={1000}
				defaultValue={values.about ?? seller.about ?? ""}
				error={errors.about}
			/>
		</div>
	)
}
