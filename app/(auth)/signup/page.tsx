import { AuthCard } from "@/components/auth/auth-card"
import { getCurrentUser } from "@/lib/auth/session"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { SignUpForm } from "./signup-form"

export const metadata: Metadata = { title: "Sign up" }

export default async function SignUpPage({ searchParams }: PageProps<"/signup">) {
	if (await getCurrentUser()) {
		redirect("/")
	}

	const { next } = await searchParams
	const logInHref = typeof next === "string" ? `/login?next=${encodeURIComponent(next)}` : "/login"

	return (
		<AuthCard
			title="Create your account"
			description={
				<>
					Already have one?{" "}
					<Link href={logInHref} className="text-primary font-medium hover:underline">
						Log in
					</Link>
				</>
			}
		>
			<SignUpForm />
		</AuthCard>
	)
}
