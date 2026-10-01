"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SubmitButton } from "@/components/forms/submit-button"
import { resetPassword } from "@/lib/auth/actions"
import { useActionState } from "react"

export function ResetPasswordForm() {
	const [state, action, pending] = useActionState(resetPassword, {})

	return (
		<form action={action} className="grid gap-5" noValidate>
			<FormAlert message={state.formError} />
			<Field
				name="password"
				label="New password"
				type="password"
				autoComplete="new-password"
				required
				hint="At least 8 characters, with letters and numbers."
				error={state.fieldErrors?.password}
			/>
			<Field
				name="confirmPassword"
				label="Confirm new password"
				type="password"
				autoComplete="new-password"
				required
				error={state.fieldErrors?.confirmPassword}
			/>
			<SubmitButton pending={pending}>Update password</SubmitButton>
		</form>
	)
}
