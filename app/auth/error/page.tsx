import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Authentication error" }

export default function AuthError() {
	return (
		<main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-2xl font-semibold">We couldn&apos;t sign you in</h1>
			<p className="text-muted-foreground">The link may have expired or already been used. Please try again.</p>
			<Link href="/" className="font-medium underline underline-offset-4">
				Back to home
			</Link>
		</main>
	)
}
