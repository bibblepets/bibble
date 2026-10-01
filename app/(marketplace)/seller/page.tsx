import { SellerSummary } from "@/components/seller/seller-summary"
import { SetupChecklist } from "@/components/seller/setup-checklist"
import { StatusBanner } from "@/components/seller/status-banner"
import { buttonVariants } from "@/components/ui/button"
import { todayInSingapore } from "@/lib/dates"
import { isEditableInWizard, resumeStep } from "@/lib/sellers/progress"
import { requireSeller } from "@/lib/sellers/queries"
import { daysUntil } from "@/lib/sellers/status"
import { stepPath } from "@/lib/sellers/wizard"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Your seller account" }

const EXPIRY_WARNING_DAYS = 30

export default async function SellerDashboardPage() {
	const seller = await requireSeller("/seller")
	const inWizard = isEditableInWizard(seller.status)
	const daysLeft = seller.licenceExpiresOn ? daysUntil(seller.licenceExpiresOn, todayInSingapore()) : null

	return (
		<main className="mx-auto grid w-full max-w-4xl flex-1 gap-8 px-4 py-10 sm:px-6">
			<div className="flex flex-wrap items-end justify-between gap-4">
				<div>
					<p className="text-muted-foreground text-sm font-medium">Seller account</p>
					<h1 className="text-3xl font-semibold tracking-tight">{seller.displayName ?? "Your business"}</h1>
				</div>
				{!inWizard && (
					<Link href="/seller/profile" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
						Edit details
					</Link>
				)}
			</div>

			<StatusBanner status={seller.status}>
				{inWizard && (
					<>
						<SetupChecklist seller={seller} />
						<Link href={stepPath(resumeStep(seller))} className={cn(buttonVariants(), "h-10 w-fit px-4")}>
							{seller.status === "rejected" ? "Review and resubmit" : "Continue setup"}
						</Link>
					</>
				)}
			</StatusBanner>

			{daysLeft !== null && daysLeft <= EXPIRY_WARNING_DAYS && !inWizard && (
				<section role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950">
					<h2 className="font-semibold">
						{daysLeft < 0 ? "Your AVS licence has expired" : `Your AVS licence expires in ${daysLeft} days`}
					</h2>
					<p className="mt-1">
						You can&apos;t publish new listings with an expired licence. Once you&apos;ve renewed it with AVS,{" "}
						<Link href="/seller/profile" className="font-semibold underline underline-offset-4">
							update the expiry date
						</Link>
						.
					</p>
				</section>
			)}

			<div className="rounded-2xl border p-6">
				<SellerSummary seller={seller} />
			</div>
		</main>
	)
}
