import { statusDisplay, type ListingStatus, type StatusTone } from "@/lib/listings/status"
import { cn } from "@/lib/utils"

const tones: Record<StatusTone, string> = {
	neutral: "bg-muted text-foreground",
	info: "bg-sky-100 text-sky-900",
	success: "bg-emerald-100 text-emerald-900",
	warning: "bg-amber-100 text-amber-950",
	danger: "bg-red-100 text-red-900",
}

export function StatusBadge({ status, className }: { status: ListingStatus; className?: string }) {
	const { label, tone } = statusDisplay[status]
	return (
		<span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>
			{label}
		</span>
	)
}
