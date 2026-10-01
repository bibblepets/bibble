import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

export type FieldControlProps = {
	id: string
	"aria-invalid"?: true
	"aria-describedby"?: string
}

type FieldShellProps = {
	name: string
	label: string
	error?: string
	hint?: string
	/** Renders the control with the id and ARIA attributes that tie it to the label, error and hint. */
	children: (control: FieldControlProps) => ReactNode
}

/** Label, error and hint around any form control, wired up through `aria-describedby`. */
export function FieldShell({ name, label, error, hint, children }: FieldShellProps) {
	const id = `field-${name}`
	// The error replaces the hint rather than stacking two messages under the field.
	const hintId = hint && !error ? `${id}-hint` : undefined
	const errorId = error ? `${id}-error` : undefined
	const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			{children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
			{error && (
				<p id={errorId} className="text-destructive text-sm">
					{error}
				</p>
			)}
			{hintId && (
				<p id={hintId} className="text-muted-foreground text-sm">
					{hint}
				</p>
			)}
		</div>
	)
}

/** Shared look for native controls that sit alongside shadcn's Input. */
export const controlClassName =
	"border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 w-full min-w-0 rounded-lg border bg-transparent px-3 text-base transition-colors outline-none focus-visible:ring-3 aria-invalid:ring-3 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
