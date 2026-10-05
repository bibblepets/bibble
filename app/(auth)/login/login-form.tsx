"use client"

import { Field } from "@/components/forms/field"
import { FormAlert } from "@/components/forms/form-alert"
import { SubmitButton } from "@/components/forms/submit-button"
import { logIn } from "@/lib/auth/actions"
import Link from "next/link"
import { useActionState } from "react"

export function LogInForm({ next }: { next?: string }) {
	const [state, action, pending] = useActionState(logIn, {})

	return (
		<form action={action} className="grid gap-5" noValidate>
			<FormAlert message={state.formError} />
			{next && <input type="hidden" name="next" value={next} />}
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
				autoComplete="current-password"
				required
				error={state.fieldErrors?.password}
			/>
			<Link
				href="/forgot-password"
				className="text-primary -mt-2 justify-self-start text-sm font-medium hover:underline"
			>
				Forgot password?
			</Link>
			<SubmitButton pending={pending}>Log in</SubmitButton>
		</form>
	)
}
