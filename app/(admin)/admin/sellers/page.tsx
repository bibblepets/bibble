import { SellersTable } from "@/components/admin/sellers-table"
import { StatusTabs } from "@/components/admin/status-tabs"
import { queueStatuses, statusLabels } from "@/lib/admin/display"
import { countSellersByStatus, listSellersForReview } from "@/lib/admin/queries"
import { requireAdmin } from "@/lib/admin/session"
import type { SellerStatus } from "@/lib/sellers/progress"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Sellers · Admin" }

export default async function AdminSellersPage({ searchParams }: PageProps<"/admin/sellers">) {
	await requireAdmin("/admin/sellers")
	const { status: requested } = await searchParams
	const status = queueStatuses.find((s) => s === requested) ?? ("pending" satisfies SellerStatus)

	const [counts, rows] = await Promise.all([countSellersByStatus(), listSellersForReview(status)])

	return (
		<main className="mx-auto grid w-full max-w-7xl flex-1 content-start gap-6 px-4 py-8 sm:px-6 lg:px-10">
			<div>
				<h1 className="text-2xl font-semibold tracking-tight">Sellers</h1>
				<p className="text-muted-foreground mt-1">
					{status === "pending"
						? "Oldest submissions first. Check each licence against the AVS registry before approving."
						: `${statusLabels[status]} sellers, most recently updated first.`}
				</p>
			</div>
			<StatusTabs current={status} counts={counts} />
			<SellersTable rows={rows} waiting={status === "pending"} />
		</main>
	)
}
