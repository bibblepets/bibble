import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ComponentProps } from "react"

type FieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
	name: string
	label: string
	error?: string
	hint?: string
}

/** Labelled input with its error and hint wired up through `aria-describedby`. */
export function Field({ name, label, error, hint, ...inputProps }: FieldProps) {
	const id = `field-${name}`
	// The error replaces the hint rather than stacking two messages under the field.
	const hintId = hint && !error ? `${id}-hint` : undefined
	const errorId = error ? `${id}-error` : undefined
	const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined

	return (
		<div className="grid gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Input
				id={id}
				name={name}
				aria-invalid={error ? true : undefined}
				aria-describedby={describedBy}
				className="h-11 px-3"
				{...inputProps}
			/>
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
