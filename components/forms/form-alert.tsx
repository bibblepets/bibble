import { CircleAlertIcon } from "lucide-react"

/** Form-level error, announced to screen readers when it appears. */
export function FormAlert({ message }: { message?: string }) {
	if (!message) {
		return null
	}
	return (
		<div role="alert" className="bg-destructive/10 text-destructive flex gap-2 rounded-lg p-3 text-sm">
			<CircleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
			<p>{message}</p>
		</div>
	)
}
