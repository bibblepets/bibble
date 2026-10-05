"use client"

import { StatusBadge } from "@/components/listings/status-badge"
import { Button } from "@/components/ui/button"
import { changeListingStatus, deleteDraft } from "@/lib/listings/actions"
import type { ListingIssue } from "@/lib/listings/rules"
import type { ListingStatus } from "@/lib/listings/status"
import { CircleAlertIcon, CircleCheckIcon, Loader2Icon } from "lucide-react"
import { useState, useTransition, type ReactNode } from "react"

const statusNotes: Record<ListingStatus, string> = {
	draft: "Only you can see this draft.",
	changes_requested: "Bibble asked for changes. Fix them and submit again.",
	pending_review: "We're checking this listing against AVS rules. You can't edit it while it's in review.",
	published: "Live on Bibble.",
	reserved: "Live, and shown to buyers as reserved.",
	sold: "Shown to buyers as sold.",
	rejected: "This listing was rejected and can't be resubmitted.",
	suspended: "Hidden by Bibble. Contact us to resolve this.",
	archived: "Archived. Buyers can't see it.",
}

type Action = Parameters<typeof changeListingStatus>[1] | "delete"

type ListingActionsProps = {
	listingId: string
	status: ListingStatus
	issues: ListingIssue[]
	/** Drafts that were never submitted can be deleted; everything else is archived. */
	canDelete: boolean
}

/** The editor's side panel: status, what's left to do, and the actions for the current status. */
export function ListingActions({ listingId, status, issues, canDelete }: ListingActionsProps) {
	const [pending, startTransition] = useTransition()
	const [running, setRunning] = useState<Action | null>(null)
	const [error, setError] = useState<string | null>(null)

	function run(action: Action) {
		setRunning(action)
		startTransition(async () => {
			const result = action === "delete" ? await deleteDraft(listingId) : await changeListingStatus(listingId, action)
			setError(result?.error ?? null)
			setRunning(null)
		})
	}

	const button = (action: Action, label: string, variant: "default" | "outline" = "outline", disabled = false) => (
		<Button
			type="button"
			variant={variant}
			disabled={pending || disabled}
			onClick={() => run(action)}
			className="h-10 w-full"
		>
			{running === action && <Loader2Icon className="animate-spin" aria-hidden />}
			{label}
		</Button>
	)

	const editable = status === "draft" || status === "changes_requested"
	const live = status === "published" || status === "reserved"

	return (
		<section aria-label="Listing status" className="grid gap-5 rounded-2xl border p-5">
			<div className="grid gap-2">
				<StatusBadge status={status} className="w-fit" />
				<p className="text-sm">{statusNotes[status]}</p>
			</div>

			{error && (
				<p role="alert" className="bg-destructive/10 text-destructive rounded-lg p-3 text-sm">
					{error}
				</p>
			)}

			{editable && (
				<>
					<SubmitChecklist issues={issues} />
					{button("submit", "Submit for review", "default", issues.length > 0)}
					{canDelete ? (
						<Confirm
							key="delete"
							label="Delete draft"
							warning="This deletes the draft for good."
							confirmLabel="Yes, delete"
						>
							{button("delete", "Yes, delete")}
						</Confirm>
					) : (
						<Confirm
							key="archive"
							label="Archive"
							warning="Archived listings can't be brought back."
							confirmLabel="Yes, archive"
						>
							{button("archive", "Yes, archive")}
						</Confirm>
					)}
				</>
			)}

			{live && (
				<div className="grid gap-2">
					{status === "published" ? button("reserve", "Mark as reserved") : button("unreserve", "Mark as available")}
					{button("sell", "Mark as sold")}
					<Confirm
						label="Revise listing"
						warning="Your listing leaves the marketplace while you edit it, and goes live again once we've re-approved it."
						confirmLabel="Yes, revise"
					>
						{button("revise", "Yes, revise")}
					</Confirm>
					<Confirm
						key="archive"
						label="Archive"
						warning="Archived listings can't be brought back."
						confirmLabel="Yes, archive"
					>
						{button("archive", "Yes, archive")}
					</Confirm>
				</div>
			)}

			{(status === "sold" || status === "rejected" || status === "suspended") && (
				<Confirm
					key="archive"
					label="Archive"
					warning="Archived listings can't be brought back."
					confirmLabel="Yes, archive"
				>
					{button("archive", "Yes, archive")}
				</Confirm>
			)}
		</section>
	)
}

/** What still needs doing before the listing can be submitted, linked to each section. */
function SubmitChecklist({ issues }: { issues: ListingIssue[] }) {
	if (issues.length === 0) {
		return (
			<p className="flex items-center gap-2 text-sm font-medium">
				<CircleCheckIcon className="size-5 text-emerald-600" aria-hidden />
				Ready to submit
			</p>
		)
	}
	return (
		<div>
			<h3 className="text-sm font-semibold">Before you can submit</h3>
			<ul className="mt-2 grid gap-2 text-sm" aria-label="Before you can submit">
				{issues.map((issue, index) => (
					<li key={index} className="flex gap-2">
						<CircleAlertIcon className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden />
						{issue.section ? (
							<a href={`#${issue.section}`} className="underline-offset-4 hover:underline">
								{issue.message}
							</a>
						) : (
							<span>{issue.message}</span>
						)}
					</li>
				))}
			</ul>
		</div>
	)
}

/** A button that asks for confirmation before showing the real action. */
function Confirm({
	label,
	warning,
	confirmLabel,
	children,
}: {
	label: string
	warning: string
	confirmLabel: string
	children: ReactNode
}) {
	const [open, setOpen] = useState(false)

	if (!open) {
		return (
			<Button type="button" variant="outline" onClick={() => setOpen(true)} className="h-10 w-full">
				{label}
			</Button>
		)
	}
	return (
		<div
			role="group"
			aria-label={`Confirm: ${confirmLabel.replace(/^Yes, /, "")}`}
			className="grid gap-2 rounded-xl border p-3"
		>
			<p className="text-sm">{warning}</p>
			{children}
			<Button type="button" variant="ghost" onClick={() => setOpen(false)} className="h-9 w-full">
				Cancel
			</Button>
		</div>
	)
}
