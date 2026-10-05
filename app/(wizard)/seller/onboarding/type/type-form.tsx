"use client"

import { FormAlert } from "@/components/forms/form-alert"
import { WizardFooter } from "@/components/seller/wizard-footer"
import { saveTypeStep } from "@/lib/sellers/actions"
import type { Species } from "@/lib/sellers/queries"
import type { SellerType } from "@/lib/sellers/schema"
import { cn } from "@/lib/utils"
import { StoreIcon, WarehouseIcon, type LucideIcon } from "lucide-react"
import { useActionState } from "react"

const types: { value: SellerType; title: string; description: string; icon: LucideIcon }[] = [
	{
		value: "pet_shop",
		title: "Pet shop",
		description: "You hold an AVS pet shop licence (starts with AS) and sell animals from licensed sources.",
		icon: StoreIcon,
	},
	{
		value: "breeder",
		title: "Breeder",
		description: "You hold an AVS breeding licence (starts with BR) and sell animals you've bred.",
		icon: WarehouseIcon,
	},
]

const cardClassName =
	"has-[:checked]:border-foreground has-[:checked]:ring-foreground has-[:focus-visible]:ring-ring/50 relative flex cursor-pointer gap-4 rounded-xl border p-5 transition-colors has-[:checked]:ring-1 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-60 has-[:focus-visible]:ring-3"

type TypeFormProps = { species: Species[]; defaultType?: SellerType; defaultSpecies: string[] }

export function TypeForm({ species, defaultType, defaultSpecies }: TypeFormProps) {
	const [state, action, pending] = useActionState(saveTypeStep, {})
	const selectedType = state.values?.sellerType ?? defaultType

	return (
		<form id="wizard-step" action={action} className="grid gap-10" noValidate>
			<FormAlert message={state.formError} />

			<fieldset aria-describedby={state.fieldErrors?.sellerType ? "sellerType-error" : undefined}>
				<legend className="sr-only">Business type</legend>
				<div className="grid gap-3">
					{types.map(({ value, title, description, icon: Icon }) => (
						<label key={value} className={cardClassName}>
							<input
								type="radio"
								name="sellerType"
								value={value}
								defaultChecked={selectedType === value}
								className="sr-only"
							/>
							<Icon className="mt-0.5 size-7 shrink-0" aria-hidden />
							<span>
								<span className="block text-lg font-semibold">{title}</span>
								<span className="text-muted-foreground mt-1 block">{description}</span>
							</span>
						</label>
					))}
				</div>
				{state.fieldErrors?.sellerType && (
					<p id="sellerType-error" className="text-destructive mt-2 text-sm">
						{state.fieldErrors.sellerType}
					</p>
				)}
			</fieldset>

			<fieldset aria-describedby={state.fieldErrors?.species ? "species-error" : "species-hint"}>
				<legend className="text-xl font-semibold">Which animals does your licence cover?</legend>
				<p id="species-hint" className="text-muted-foreground mt-1">
					We&apos;ll check this against your licence.
				</p>
				<div className="mt-4 grid gap-3 sm:grid-cols-2">
					{species.map((s) => (
						<label key={s.slug} className={cn(cardClassName, "items-center justify-between p-4")}>
							<span className="font-medium">
								{s.name}
								{!s.isActive && <span className="text-muted-foreground block text-sm font-normal">Coming soon</span>}
							</span>
							<input
								type="checkbox"
								name="species"
								value={s.slug}
								disabled={!s.isActive}
								defaultChecked={s.isActive && defaultSpecies.includes(s.slug)}
								className="accent-foreground size-5"
							/>
						</label>
					))}
				</div>
				{state.fieldErrors?.species && (
					<p id="species-error" className="text-destructive mt-2 text-sm">
						{state.fieldErrors.species}
					</p>
				)}
			</fieldset>

			<WizardFooter step="type" next={{ kind: "submit", formId: "wizard-step", pending }} />
		</form>
	)
}
