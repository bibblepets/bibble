import { WizardHeader } from "@/components/seller/wizard-header"
import { buttonVariants } from "@/components/ui/button"
import { requireUser } from "@/lib/auth/session"
import { isEditableInWizard, resumeStep } from "@/lib/sellers/progress"
import { getCurrentSeller } from "@/lib/sellers/queries"
import { stepPath } from "@/lib/sellers/wizard"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = { title: "Sell on Bibble" }

const stages = [
	{
		title: "Tell us about your business",
		description: "Your business type, ACRA registration and AVS licence, and where your premises are.",
	},
	{
		title: "Upload your documents",
		description: "Your AVS licence and an ACRA BizFile profile, so we can confirm they match.",
	},
	{
		title: "Get verified",
		description: "We check every seller before they can list. It usually takes up to 2 working days.",
	},
]

export default async function OnboardingIntroPage() {
	await requireUser("/seller/onboarding")
	const seller = await getCurrentSeller()
	if (seller && !isEditableInWizard(seller.status)) {
		redirect("/seller")
	}

	return (
		<>
			<WizardHeader exitHref={seller ? "/seller" : "/"} />
			<main className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 px-4 py-10 sm:px-6 md:grid-cols-2 md:gap-16 lg:px-10">
				<div>
					<h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Sell on Bibble</h1>
					<p className="text-muted-foreground mt-4 text-lg">
						Bibble only works with AVS-licensed pet shops and breeders, so buyers know every animal comes from a legal,
						accountable source.
					</p>
				</div>
				<ol className="divide-y">
					{stages.map((stage, index) => (
						<li key={stage.title} className="flex gap-4 py-6">
							<span className="text-xl font-semibold">{index + 1}</span>
							<div>
								<h2 className="text-xl font-semibold">{stage.title}</h2>
								<p className="text-muted-foreground mt-1">{stage.description}</p>
							</div>
						</li>
					))}
				</ol>
			</main>
			<footer className="border-t">
				<div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-end px-4 sm:px-6 lg:px-10">
					<Link href={stepPath(resumeStep(seller))} className={cn(buttonVariants(), "h-12 rounded-lg px-6 text-base")}>
						{seller ? "Continue" : "Get started"}
					</Link>
				</div>
			</footer>
		</>
	)
}
