"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-2xl font-semibold">Something went wrong</h1>
			<p className="text-muted-foreground">An unexpected error occurred. Please try again.</p>
			<Button onClick={() => reset()}>Try again</Button>
		</main>
	)
}
