import { WizardHeader } from "@/components/seller/wizard-header"
import { WizardPage } from "@/components/seller/wizard-page"
import { licenceExample } from "@/lib/sellers/schema"
import { sellerTypeLabels } from "@/lib/sellers/status"
import { loadExistingSellerStep } from "@/lib/sellers/wizard"
import type { Metadata } from "next"
import { BusinessForm } from "./business-form"

export const metadata: Metadata = { title: "Your business details" }

export default async function BusinessStepPage() {
	const seller = await loadExistingSellerStep("business")

	return (
		<>
			<WizardHeader saveFormId="wizard-step" />
			<WizardPage
				title="Your business details"
				description="These must match your ACRA registration and AVS licence exactly. You can't change them after submitting."
			>
				<BusinessForm
					licenceLabel={`AVS ${sellerTypeLabels[seller.sellerType].toLowerCase()} licence number`}
					licenceExample={licenceExample(seller.sellerType)}
					defaults={{
						displayName: seller.displayName ?? "",
						legalName: seller.legalName ?? "",
						uen: seller.uen ?? "",
						licenceNo: seller.licenceNo ?? "",
						licenceExpiresOn: seller.licenceExpiresOn ?? "",
					}}
				/>
			</WizardPage>
		</>
	)
}
