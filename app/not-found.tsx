import Link from "next/link"

export default function NotFound() {
	return (
		<main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="text-2xl font-semibold">Page not found</h1>
			<p className="text-muted-foreground">We couldn&apos;t find the page you were looking for.</p>
			<Link href="/" className="font-medium underline underline-offset-4">
				Back to home
			</Link>
		</main>
	)
}
