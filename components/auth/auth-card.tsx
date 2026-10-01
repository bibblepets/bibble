import type { ReactNode } from "react"

/** Centred card shared by the auth pages, styled after Airbnb's log-in screen. */
export function AuthCard({
	title,
	description,
	children,
}: {
	title: string
	description?: ReactNode
	children: ReactNode
}) {
	return (
		<main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-16">
			<div className="w-full max-w-md rounded-2xl border p-6 shadow-sm sm:p-8">
				<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
				{description && <div className="text-muted-foreground mt-2">{description}</div>}
				<div className="mt-6">{children}</div>
			</div>
		</main>
	)
}
