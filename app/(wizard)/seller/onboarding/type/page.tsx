import { WizardHeader } from "@/components/seller/wizard-header"
import { WizardPage } from "@/components/seller/wizard-page"
import { listSpecies } from "@/lib/sellers/queries"
import { loadWizardStep } from "@/lib/sellers/wizard"
import type { Metadata } from "next"
import { TypeForm } from "./type-form"

export const metadata: Metadata = { title: "Your business type" }

export default async function TypeStepPage() {
	const seller = await loadWizardStep("type")
	const species = await listSpecies()

	return (
		<>
			<WizardHeader saveFormId="wizard-step" />
			<WizardPage title="Which best describes your business?" description="Choose the licence you hold with AVS.">
				<TypeForm
					species={species}
					defaultType={seller?.sellerType}
					defaultSpecies={seller ? seller.species.map((s) => s.slug) : ["dog"]}
				/>
			</WizardPage>
		</>
	)
}
