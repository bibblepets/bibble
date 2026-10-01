import { decisionLabels, formatDateTime } from "@/lib/admin/display"
import type { ReviewEntry } from "@/lib/admin/queries"

export function ReviewHistory({ entries }: { entries: ReviewEntry[] }) {
	if (entries.length === 0) {
		return <p className="text-muted-foreground text-sm">No decisions yet.</p>
	}

	return (
		<ol className="grid gap-4">
			{entries.map((entry) => (
				<li key={entry.id} className="border-l-2 pl-4 text-sm">
					<p>
						<span className="font-semibold">{decisionLabels[entry.decision] ?? entry.decision}</span>
						<span className="text-muted-foreground">
							{" "}
							by {entry.reviewerName ?? "a former admin"} · {formatDateTime(entry.createdAt)}
						</span>
					</p>
					{entry.message && (
						<p className="mt-1">
							<span className="text-muted-foreground">To seller: </span>
							{entry.message}
						</p>
					)}
					{entry.internalNote && (
						<p className="mt-1">
							<span className="text-muted-foreground">Internal: </span>
							{entry.internalNote}
						</p>
					)}
					{entry.checklist.length > 0 && (
						<p className="text-muted-foreground mt-1">All {entry.checklist.length} checks ticked</p>
					)}
				</li>
			))}
		</ol>
	)
}
