import { z } from "zod"

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address."))

/** Mirrors the Supabase Auth settings in supabase/config.toml (8+ characters, letters and digits). */
export const newPasswordSchema = z
	.string()
	.min(8, "Use at least 8 characters.")
	// bcrypt ignores everything after 72 bytes.
	.max(72, "Use 72 characters or fewer.")
	.regex(/[A-Za-z]/, "Include at least one letter.")
	.regex(/\d/, "Include at least one number.")

export const signUpSchema = z.object({
	displayName: z.string().trim().min(1, "Enter your name.").max(80, "Use 80 characters or fewer."),
	email,
	password: newPasswordSchema,
})

export const logInSchema = z.object({
	email,
	password: z.string().min(1, "Enter your password."),
})

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
	.object({ password: newPasswordSchema, confirmPassword: z.string() })
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match.",
		path: ["confirmPassword"],
	})
