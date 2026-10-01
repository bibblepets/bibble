"use client"

import { FormAlert } from "@/components/forms/form-alert"
import { TextareaField } from "@/components/forms/textarea-field"
import { Button } from "@/components/ui/button"
import { reviewSeller } from "@/lib/admin/actions"
import { approvalChecklist } from "@/lib/admin/checklist"
import type { SellerStatus } from "@/lib/sellers/progress"
import { Loader2Icon } from "lucide-react"
import { useActionState, useState } from "react"

const waiting: Partial<Record<SellerStatus, string>> = {
	incomplete: "The seller is still filling in their details. There's nothing to review yet.",
	rejected: "Waiting for the seller to fix their details and resubmit.",
}

export function DecisionPanel({ sellerId, status }: { sellerId: string; status: SellerStatus }) {
	const [state, action, pending] = useActionState(reviewSeller.bind(null, sellerId), {})
	const [ticked, setTicked] = useState<string[]>([])
	const errors = state.fieldErrors ?? {}

	if (waiting[status]) {
		return <p className="text-muted-foreground">{waiting[status]}</p>
	}

	const notes = (
		<>
			<TextareaField
				name="message"
				label={status === "suspended" ? "Message to the seller (optional)" : "Message to the seller"}
				hint={
					status === "pending"
						? "Required to reject. Shown on their dashboard, so say what to fix."
						: "Shown on their dashboard."
				}
				rows={3}
				maxLength={1000}
				defaultValue={state.values?.message}
				error={errors.message}
			/>
			<TextareaField
				name="internalNote"
				label="Internal note (optional)"
				hint="Only admins see this."
				rows={2}
				maxLength={2000}
				defaultValue={state.values?.internalNote}
				error={errors.internalNote}
			/>
		</>
	)
	const spinner = pending && <Loader2Icon className="animate-spin" aria-hidden />

	return (
		<form action={action} className="grid gap-5">
			<FormAlert message={state.formError} />

			{status === "pending" && (
				<fieldset aria-describedby={errors.checklist ? "checklist-error" : undefined}>
					<legend className="font-semibold">Verification checklist</legend>
					<div className="mt-3 grid gap-2">
						{approvalChecklist.map(({ key, label }) => (
							<label key={key} className="flex items-start gap-3 text-sm">
								<input
									type="checkbox"
									name="checklist"
									value={key}
									checked={ticked.includes(key)}
									onChange={(event) =>
										setTicked((current) =>
											event.target.checked ? [...current, key] : current.filter((k) => k !== key)
										)
									}
									className="accent-foreground mt-0.5 size-4 shrink-0"
								/>
								{label}
							</label>
						))}
					</div>
					{errors.checklist && (
						<p id="checklist-error" className="text-destructive mt-2 text-sm">
							{errors.checklist}
						</p>
					)}
				</fieldset>
			)}

			{notes}

			<div className="flex flex-wrap gap-3">
				{status === "pending" && (
					<>
						<Button
							type="submit"
							name="decision"
							value="approved"
							disabled={pending || ticked.length < approvalChecklist.length}
							className="h-10 px-4"
						>
							{spinner}
							Approve
						</Button>
						<Button
							type="submit"
							name="decision"
							value="rejected"
							variant="outline"
							disabled={pending}
							className="h-10 px-4"
						>
							Reject
						</Button>
					</>
				)}
				{status === "verified" && (
					<Button
						type="submit"
						name="decision"
						value="suspended"
						variant="destructive"
						disabled={pending}
						className="h-10 px-4"
					>
						{spinner}
						Suspend seller
					</Button>
				)}
				{status === "suspended" && (
					<Button type="submit" name="decision" value="reinstated" disabled={pending} className="h-10 px-4">
						{spinner}
						Reinstate seller
					</Button>
				)}
			</div>
		</form>
	)
}
