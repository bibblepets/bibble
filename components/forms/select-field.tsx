import { cn } from "@/lib/utils"
import type { ComponentProps } from "react"
import { controlClassName, FieldShell } from "./field-shell"

type SelectFieldProps = Omit<ComponentProps<"select">, "id" | "name"> & {
	name: string
	label: string
	error?: string
	hint?: string
}

/** Native select: accessible and mobile-friendly for long lists like areas. */
export function SelectField({ name, label, error, hint, className, children, ...props }: SelectFieldProps) {
	return (
		<FieldShell name={name} label={label} error={error} hint={hint}>
			{(control) => (
				<select
					// Remount when the default changes (e.g. after a save comes back from the server): native selects
					// ignore defaultValue changes after mount, and React's post-action form reset would use the stale one.
					key={String(props.defaultValue ?? "")}
					name={name}
					className={cn(controlClassName, "h-11", className)}
					{...control}
					{...props}
				>
					{children}
				</select>
			)}
		</FieldShell>
	)
}
