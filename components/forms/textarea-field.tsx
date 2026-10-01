import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { controlClassName, FieldShell } from "./field-shell"

type TextareaFieldProps = Omit<ComponentProps<"textarea">, "id" | "name"> & {
	name: string
	label: string
	error?: string
	hint?: string
}

export function TextareaField({ name, label, error, hint, className, ...props }: TextareaFieldProps) {
	return (
		<FieldShell name={name} label={label} error={error} hint={hint}>
			{(control) => (
				<textarea name={name} rows={4} className={cn(controlClassName, "py-2", className)} {...control} {...props} />
			)}
		</FieldShell>
	)
}
