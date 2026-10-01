import { SellerSummary } from "@/components/seller/seller-summary"
import { WizardHeader } from "@/components/seller/wizard-header"
import { WizardPage } from "@/components/seller/wizard-page"
import { getSellerFeedback } from "@/lib/sellers/queries"
import { loadExistingSellerStep } from "@/lib/sellers/wizard"
import type { Metadata } from "next"
import { SubmitForm } from "./submit-form"

export const metadata: Metadata = { title: "Review and submit" }

export default async function ReviewStepPage() {
	const seller = await loadExistingSellerStep("review")
	const feedback = seller.status === "rejected" ? await getSellerFeedback(seller.id) : null

	return (
		<>
			<WizardHeader exitHref="/seller" />
			<WizardPage
				title="Review and submit"
				description="Check everything is correct. After you submit, your business type, registered name, UEN, licence number and animals can only be changed by contacting us."
			>
				{seller.status === "rejected" && (
					<div role="status" className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
						<p className="font-semibold">We couldn&apos;t verify your previous submission.</p>
						{feedback?.message && (
							<p className="mt-1 text-sm">
								<span className="font-semibold">Reason:</span> {feedback.message}
							</p>
						)}
						<p className="mt-1 text-sm">
							Check the details below, fix anything that doesn&apos;t match, and submit again.
						</p>
					</div>
				)}
				<SellerSummary seller={seller} editLinks />
				<SubmitForm />
			</WizardPage>
		</>
	)
}
