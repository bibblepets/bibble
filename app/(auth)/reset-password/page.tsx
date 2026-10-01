import { AuthCard } from "@/components/auth/auth-card"
import { requireUser } from "@/lib/auth/session"
import type { Metadata } from "next"
import { ResetPasswordForm } from "./reset-password-form"

export const metadata: Metadata = { title: "Choose a new password" }

/** Reached from the recovery email: app/auth/confirm signs the user in before redirecting here. */
export default async function ResetPasswordPage() {
	const user = await requireUser("/reset-password")

	return (
		<AuthCard title="Choose a new password" description={`For ${user.email}`}>
			<ResetPasswordForm />
		</AuthCard>
	)
}
