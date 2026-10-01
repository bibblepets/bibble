import type { SellerStatus } from "@/lib/sellers/progress"
import { statusCopy } from "@/lib/sellers/status"
import { cn } from "@/lib/utils"
import { BadgeCheckIcon, ClockIcon, OctagonAlertIcon, TriangleAlertIcon, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

const tones: Record<ReturnType<typeof statusCopy>["tone"], { className: string; icon: LucideIcon }> = {
	info: { className: "border-sky-200 bg-sky-50 text-sky-950", icon: ClockIcon },
	success: { className: "border-emerald-200 bg-emerald-50 text-emerald-950", icon: BadgeCheckIcon },
	warning: { className: "border-amber-300 bg-amber-50 text-amber-950", icon: TriangleAlertIcon },
	danger: { className: "border-red-200 bg-red-50 text-red-950", icon: OctagonAlertIcon },
}

type StatusBannerProps = {
	status: SellerStatus
	/** The admin's message for a rejection or suspension. */
	reason?: string | null
	children?: ReactNode
}

export function StatusBanner({ status, reason, children }: StatusBannerProps) {
	const { title, description, tone } = statusCopy(status)
	const { className, icon: Icon } = tones[tone]

	return (
		<section
			role="status"
			aria-label="Verification status"
			className={cn("flex gap-4 rounded-2xl border p-5", className)}
		>
			<Icon className="mt-0.5 size-6 shrink-0" aria-hidden />
			<div className="grid gap-3">
				<div>
					<h2 className="text-lg font-semibold">{title}</h2>
					<p className="mt-1">{description}</p>
					{reason && (
						<p className="mt-2">
							<span className="font-semibold">Reason:</span> {reason}
						</p>
					)}
				</div>
				{children}
			</div>
		</section>
	)
}
