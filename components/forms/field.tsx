import { Input } from "@/components/ui/input"
import type { ComponentProps } from "react"
import { FieldShell } from "./field-shell"

type FieldProps = Omit<ComponentProps<"input">, "id" | "name"> & {
	name: string
	label: string
	error?: string
	hint?: string
}

/** Labelled input with its error and hint wired up through `aria-describedby`. */
export function Field({ name, label, error, hint, defaultValue = "", ...inputProps }: FieldProps) {
	return (
		<FieldShell name={name} label={label} error={error} hint={hint}>
			{(control) => (
				<Input
					// Base UI warns when an uncontrolled input's defaultValue changes after mount, which happens when an
					// action returns the submitted values. Remounting on a new default applies it cleanly; defaulting to ""
					// keeps undefined → "" (an empty field sent back) from counting as a change.
					key={String(defaultValue)}
					defaultValue={defaultValue}
					name={name}
					className="h-11 px-3"
					{...control}
					{...inputProps}
				/>
			)}
		</FieldShell>
	)
}
