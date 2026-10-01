import { LocationForm } from "@/components/seller/location-form"
import { WizardHeader } from "@/components/seller/wizard-header"
import { WizardPage } from "@/components/seller/wizard-page"
import { listAreas } from "@/lib/sellers/queries"
import { loadExistingSellerStep } from "@/lib/sellers/wizard"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Your premises" }

export default async function LocationStepPage() {
	const seller = await loadExistingSellerStep("location")
	const areas = await listAreas()

	return (
		<>
			<WizardHeader saveFormId="wizard-step" />
			<WizardPage
				title="Where are your premises?"
				description="Your full address stays private between you and Bibble. Buyers only see the area."
			>
				<LocationForm seller={seller} areas={areas} />
			</WizardPage>
		</>
	)
}
