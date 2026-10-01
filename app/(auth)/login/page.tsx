import { AuthCard } from "@/components/auth/auth-card"
import { getCurrentUser } from "@/lib/auth/session"
import { safeRedirectPath } from "@/lib/redirect"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { LogInForm } from "./login-form"

export const metadata: Metadata = { title: "Log in" }

export default async function LogInPage({ searchParams }: PageProps<"/login">) {
	const { next } = await searchParams
	const nextPath = typeof next === "string" ? next : undefined

	if (await getCurrentUser()) {
		redirect(safeRedirectPath(nextPath ?? null))
	}

	const signUpHref = nextPath ? `/signup?next=${encodeURIComponent(nextPath)}` : "/signup"

	return (
		<AuthCard
			title="Welcome back"
			description={
				<>
					New to Bibble?{" "}
					<Link href={signUpHref} className="text-primary font-medium hover:underline">
						Create an account
					</Link>
				</>
			}
		>
			<LogInForm next={nextPath} />
		</AuthCard>
	)
}
