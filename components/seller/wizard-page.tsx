import type { ReactNode } from "react"

/** Heading and body of a wizard step, leaving room for the fixed footer. */
export function WizardPage({
	title,
	description,
	children,
}: {
	title: string
	description?: ReactNode
	children: ReactNode
}) {
	return (
		<main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-6 pb-40 sm:px-6 md:pt-10">
			<h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
			{description && <div className="text-muted-foreground mt-3 text-lg">{description}</div>}
			<div className="mt-8">{children}</div>
		</main>
	)
}
