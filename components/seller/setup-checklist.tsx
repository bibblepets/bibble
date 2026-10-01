import { completedSteps, type SellerProgressInput, type WizardStep } from "@/lib/sellers/progress"
import { cn } from "@/lib/utils"
import { CircleCheckIcon, CircleIcon } from "lucide-react"
import Link from "next/link"

const items: { step: Exclude<WizardStep, "review">; label: string }[] = [
	{ step: "type", label: "Choose your business type" },
	{ step: "business", label: "Add your business details" },
	{ step: "location", label: "Add your premises and contact details" },
	{ step: "documents", label: "Upload your AVS licence and ACRA BizFile" },
]

/** What's left before the seller can submit, linking to each wizard step. */
export function SetupChecklist({ seller }: { seller: SellerProgressInput }) {
	const done = completedSteps(seller)

	return (
		<ul className="grid gap-2">
			{items.map(({ step, label }) => {
				const complete = done.has(step)
				return (
					<li key={step}>
						<Link
							href={`/seller/onboarding/${step}`}
							aria-label={`${label} (${complete ? "done" : "to do"})`}
							className={cn("flex items-center gap-2 hover:underline", complete && "text-muted-foreground")}
						>
							{complete ? (
								<CircleCheckIcon className="size-5 text-emerald-600" aria-hidden />
							) : (
								<CircleIcon className="size-5" aria-hidden />
							)}
							<span>{label}</span>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
