import { CircleCheckIcon, CircleIcon } from "lucide-react"
import type { ReactNode } from "react"

type EditorSectionProps = {
	id: string
	title: string
	description?: ReactNode
	complete: boolean
	children: ReactNode
}

/** One card in the listing editor, linkable from the side panel's checklist. */
export function EditorSection({ id, title, description, complete, children }: EditorSectionProps) {
	return (
		<section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 rounded-2xl border p-6">
			<div className="flex items-start justify-between gap-4">
				<div>
					<h2 id={`${id}-title`} className="text-xl font-semibold">
						{title}
					</h2>
					{description && <div className="text-muted-foreground mt-1 text-sm">{description}</div>}
				</div>
				{complete ? (
					<CircleCheckIcon className="size-6 shrink-0 text-emerald-600" aria-label="Complete" />
				) : (
					<CircleIcon className="text-muted-foreground size-6 shrink-0" aria-label="Incomplete" />
				)}
			</div>
			<div className="mt-6">{children}</div>
		</section>
	)
}
