import { AuthCard } from "@/components/auth/auth-card"
import type { Metadata } from "next"
import { ForgotPasswordForm } from "./forgot-password-form"

export const metadata: Metadata = { title: "Forgot password" }

export default function ForgotPasswordPage() {
	return (
		<AuthCard
			title="Forgot your password?"
			description="Enter your email and we'll send you a link to choose a new one."
		>
			<ForgotPasswordForm />
		</AuthCard>
	)
}
