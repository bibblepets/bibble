import { queueStatuses, statusLabels } from "@/lib/admin/display"
import type { SellerStatus } from "@/lib/sellers/progress"
import { cn } from "@/lib/utils"
import Link from "next/link"

/** Status filters for the seller queue, as links so each tab has its own URL. */
export function StatusTabs({ current, counts }: { current: SellerStatus; counts: Record<SellerStatus, number> }) {
	return (
		<nav aria-label="Seller status" className="flex gap-1 overflow-x-auto border-b">
			{queueStatuses.map((status) => (
				<Link
					key={status}
					href={`/admin/sellers?status=${status}`}
					aria-current={status === current ? "page" : undefined}
					aria-label={`${statusLabels[status]}, ${counts[status]} seller${counts[status] === 1 ? "" : "s"}`}
					className={cn(
						"-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium",
						status === current
							? "border-foreground text-foreground"
							: "text-muted-foreground hover:text-foreground border-transparent"
					)}
				>
					{statusLabels[status]}
					<span className="bg-muted rounded-full px-2 py-0.5 text-xs tabular-nums">{counts[status]}</span>
				</Link>
			))}
		</nav>
	)
}
