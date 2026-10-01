"use server"

import { authErrorMessage } from "@/lib/auth/errors"
import { forgotPasswordSchema, logInSchema, resetPasswordSchema, signUpSchema } from "@/lib/auth/schema"
import { fieldErrorsFrom, valuesFrom, type ActionState } from "@/lib/forms"
import { safeRedirectPath } from "@/lib/redirect"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type SignUpField = "displayName" | "email" | "password"
export type LogInField = "email" | "password"
export type ForgotPasswordField = "email"
export type ResetPasswordField = "password" | "confirmPassword"

export async function signUp(_prev: ActionState<SignUpField>, formData: FormData): Promise<ActionState<SignUpField>> {
	const values = valuesFrom(formData, ["displayName", "email"] as const)
	const parsed = signUpSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const { displayName, email, password } = parsed.data
	const supabase = await createClient()
	// With confirmations on, an already-registered email also "succeeds" without sending a new account email,
	// so this never reveals whether an address has an account.
	const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } })
	if (error) {
		return { formError: authErrorMessage(error), values }
	}

	redirect("/check-email?for=signup")
}

export async function logIn(_prev: ActionState<LogInField>, formData: FormData): Promise<ActionState<LogInField>> {
	const values = valuesFrom(formData, ["email"] as const)
	const parsed = logInSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const supabase = await createClient()
	const { error } = await supabase.auth.signInWithPassword(parsed.data)
	if (error) {
		return { formError: authErrorMessage(error), values }
	}

	revalidatePath("/", "layout")
	const next = formData.get("next")
	redirect(safeRedirectPath(typeof next === "string" ? next : null))
}

export async function logOut(): Promise<void> {
	const supabase = await createClient()
	await supabase.auth.signOut()
	revalidatePath("/", "layout")
	redirect("/")
}

export async function requestPasswordReset(
	_prev: ActionState<ForgotPasswordField>,
	formData: FormData
): Promise<ActionState<ForgotPasswordField>> {
	const values = valuesFrom(formData, ["email"] as const)
	const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error), values }
	}

	const supabase = await createClient()
	const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email)
	// Only rate limiting is surfaced: any other outcome looks like success so the form can't be used to
	// discover which emails have accounts.
	if (error?.code === "over_email_send_rate_limit" || error?.code === "over_request_rate_limit") {
		return { formError: authErrorMessage(error), values }
	}

	redirect("/check-email?for=reset")
}

export async function resetPassword(
	_prev: ActionState<ResetPasswordField>,
	formData: FormData
): Promise<ActionState<ResetPasswordField>> {
	const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData))
	if (!parsed.success) {
		return { fieldErrors: fieldErrorsFrom(parsed.error) }
	}

	const supabase = await createClient()
	const { error } = await supabase.auth.updateUser({ password: parsed.data.password })
	if (error) {
		return { formError: authErrorMessage(error) }
	}

	revalidatePath("/", "layout")
	redirect("/")
}
