import { CorrectionForm } from "@/components/admin/correction-form"
import { DecisionPanel } from "@/components/admin/decision-panel"
import { ReviewHistory } from "@/components/admin/review-history"
import { SellerSummary } from "@/components/seller/seller-summary"
import { avsRegistryUrls, statusLabels, uenSearchUrl } from "@/lib/admin/display"
import { getSellerForReview } from "@/lib/admin/queries"
import { requireAdmin } from "@/lib/admin/session"
import { listSpecies } from "@/lib/sellers/queries"
import { sellerTypeLabels } from "@/lib/sellers/status"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

export const metadata: Metadata = { title: "Review seller · Admin" }

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function Panel({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section aria-label={title} className="rounded-2xl border p-5">
			<h2 className="text-lg font-semibold">{title}</h2>
			<div className="mt-4">{children}</div>
		</section>
	)
}

export default async function AdminSellerPage({ params }: PageProps<"/admin/sellers/[id]">) {
	const { id } = await params
	await requireAdmin(`/admin/sellers/${id}`)
	if (!uuidPattern.test(id)) {
		notFound()
	}

	const [review, species] = await Promise.all([getSellerForReview(id), listSpecies()])
	if (!review) {
		notFound()
	}
	const { seller, owner, history } = review

	return (
		<main className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-6 px-4 py-8 sm:px-6 lg:px-10">
			<div>
				<Link
					href={`/admin/sellers?status=${seller.status}`}
					className="text-sm font-semibold underline underline-offset-4"
				>
					All {statusLabels[seller.status].toLowerCase()} sellers
				</Link>
				<div className="mt-3 flex flex-wrap items-center gap-3">
					<h1 className="text-2xl font-semibold tracking-tight">{seller.displayName ?? "Unnamed seller"}</h1>
					<span className="bg-muted rounded-full px-3 py-1 text-sm font-medium">{statusLabels[seller.status]}</span>
				</div>
				{owner && (
					<p className="text-muted-foreground mt-1">
						Owner: {owner.displayName ? `${owner.displayName} · ` : ""}
						{owner.email}
					</p>
				)}
			</div>

			<div className="grid items-start gap-6 lg:grid-cols-[1fr_26rem]">
				<div className="grid gap-6">
					<section aria-label="Verification sources" className="bg-muted/50 rounded-2xl border p-5 text-sm">
						<h2 className="font-semibold">Check against official sources</h2>
						<ul className="mt-2 grid gap-1">
							<li>
								<a
									href={avsRegistryUrls[seller.sellerType]}
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-4"
								>
									AVS registry of licensed {sellerTypeLabels[seller.sellerType].toLowerCase()}s
								</a>{" "}
								— look for <span className="font-mono">{seller.licenceNo ?? "the licence number"}</span>
							</li>
							<li>
								<a
									href={uenSearchUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="underline underline-offset-4"
								>
									UEN search
								</a>{" "}
								— look up <span className="font-mono">{seller.uen ?? "the UEN"}</span>
							</li>
						</ul>
					</section>
					<div className="rounded-2xl border p-6">
						<SellerSummary seller={seller} documentHref={(documentId) => `/admin/documents/${documentId}`} />
					</div>
				</div>

				<div className="grid gap-6 lg:sticky lg:top-6">
					<Panel title="Decision">
						<DecisionPanel sellerId={seller.id} status={seller.status} />
					</Panel>
					<Panel title="History">
						<ReviewHistory entries={history} />
					</Panel>
					<details className="rounded-2xl border p-5">
						<summary className="cursor-pointer text-lg font-semibold">Correct verified details</summary>
						<p className="text-muted-foreground mt-2 text-sm">
							For changes the seller can&apos;t make themselves, such as a renewed licence number. Recorded in the
							history.
						</p>
						<div className="mt-4">
							<CorrectionForm seller={seller} species={species} />
						</div>
					</details>
				</div>
			</div>
		</main>
	)
}
