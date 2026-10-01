import { PLACEHOLDER_INK, placeholderFor } from "@/lib/placeholder"
import { cn } from "@/lib/utils"

type PetPlaceholderProps = {
	/** Text the initials come from, e.g. the breed. */
	label: string
	/** Picks the gradient. Defaults to `label`; pass the listing id so same-breed cards differ. */
	seed?: string
	className?: string
}

/** Square artwork for listings that have no photos yet. Decorative: the card's text carries the meaning. */
export function PetPlaceholder({ label, seed, className }: PetPlaceholderProps) {
	const { initials, from, to } = placeholderFor(label, seed)

	return (
		<div
			aria-hidden
			data-testid="pet-placeholder"
			className={cn("flex aspect-square items-center justify-center rounded-xl", className)}
			style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})`, color: PLACEHOLDER_INK }}
		>
			<span className="text-4xl font-semibold tracking-tight">{initials}</span>
		</div>
	)
}
