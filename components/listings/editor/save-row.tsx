import { Button } from "@/components/ui/button"
import { CheckIcon, Loader2Icon } from "lucide-react"

/** Save button for an editor section, with a quiet confirmation once saved. Hidden when the listing is locked. */
export function SaveRow({
	pending,
	saved,
	editable,
	label = "Save",
}: {
	pending: boolean
	saved?: boolean
	editable: boolean
	label?: string
}) {
	if (!editable) {
		return null
	}
	return (
		<div className="flex items-center gap-3">
			<Button type="submit" disabled={pending} aria-busy={pending || undefined} className="h-10 px-5">
				{pending && <Loader2Icon className="animate-spin" aria-hidden />}
				{label}
			</Button>
			<span role="status" className="text-muted-foreground flex items-center gap-1 text-sm">
				{saved && !pending && (
					<>
						<CheckIcon className="size-4 text-emerald-600" aria-hidden />
						Saved
					</>
				)}
			</span>
		</div>
	)
}
