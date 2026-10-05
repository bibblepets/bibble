"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SubmitButton } from "@/components/forms/submit-button"
import { signUp } from "@/lib/auth/actions"
import { useActionState } from "react"

export function SignUpForm() {
	const [state, action, pending] = useActionState(signUp, {})

	return (
		<form action={action} className="grid gap-5" noValidate>
			<FormAlert message={state.formError} />
			<Field
				name="displayName"
				label="Name"
				autoComplete="name"
				required
				maxLength={80}
				defaultValue={state.values?.displayName}
				error={state.fieldErrors?.displayName}
			/>
			<Field
				name="email"
				label="Email"
				type="email"
				autoComplete="email"
				required
				defaultValue={state.values?.email}
				error={state.fieldErrors?.email}
			/>
			<Field
				name="password"
				label="Password"
				type="password"
				autoComplete="new-password"
				required
				hint="At least 8 characters, with letters and numbers."
				error={state.fieldErrors?.password}
			/>
			<SubmitButton pending={pending}>Create account</SubmitButton>
		</form>
	)
}
