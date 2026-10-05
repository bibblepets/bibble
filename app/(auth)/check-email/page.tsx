import { AuthCard } from "@/components/auth/auth-card"
import { MailCheckIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = { title: "Check your email" }

// Worded so it never confirms whether an address has an account.
const copy = {
	signup:
		"If this email isn't registered yet, we've sent a link to confirm it. Open it to finish creating your account.",
	reset: "If an account exists for this email, we've sent a link to reset your password.",
}

export default async function CheckEmailPage({ searchParams }: PageProps<"/check-email">) {
	const { for: purpose } = await searchParams

	return (
		<AuthCard title="Check your email">
			<div className="grid gap-6">
				<MailCheckIcon className="text-brand size-10" aria-hidden />
				<p>{purpose === "reset" ? copy.reset : copy.signup}</p>
				<p className="text-muted-foreground text-sm">
					The link expires in an hour. Can&apos;t find it? Check your spam folder.
				</p>
				<Link href="/login" className="text-primary font-medium hover:underline">
					Back to log in
				</Link>
			</div>
		</AuthCard>
	)
}
