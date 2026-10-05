import { DocumentUpload } from "@/components/seller/document-upload"
import { WizardFooter } from "@/components/seller/wizard-footer"
import { WizardHeader } from "@/components/seller/wizard-header"
import { WizardPage } from "@/components/seller/wizard-page"
import { documentKinds } from "@/lib/sellers/progress"
import { loadExistingSellerStep } from "@/lib/sellers/wizard"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Your documents" }

export default async function DocumentsStepPage() {
	const seller = await loadExistingSellerStep("documents")
	const allUploaded = documentKinds.every((kind) => seller.documents[kind])

	return (
		<>
			<WizardHeader exitHref="/seller" />
			<WizardPage
				title="Upload your documents"
				description="Only Bibble's verification team can see these. We use them to confirm your licence and registration match."
			>
				<div className="grid gap-4">
					{documentKinds.map((kind) => (
						<DocumentUpload key={kind} sellerId={seller.id} kind={kind} current={seller.documents[kind]} />
					))}
				</div>
				<WizardFooter
					step="documents"
					next={{ kind: "link", href: "/seller/onboarding/review", disabled: !allUploaded }}
				/>
			</WizardPage>
		</>
	)
}
