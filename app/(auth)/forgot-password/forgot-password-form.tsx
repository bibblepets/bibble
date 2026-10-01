"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SubmitButton } from "@/components/forms/submit-button"
import { requestPasswordReset } from "@/lib/auth/actions"
import { useActionState } from "react"

export function ForgotPasswordForm() {
	const [state, action, pending] = useActionState(requestPasswordReset, {})

	return (
		<form action={action} className="grid gap-5" noValidate>
			<FormAlert message={state.formError} />
			<Field
				name="email"
				label="Email"
				type="email"
				autoComplete="email"
				required
				defaultValue={state.values?.email}
				error={state.fieldErrors?.email}
			/>
			<SubmitButton pending={pending}>Send reset link</SubmitButton>
		</form>
	)
}
