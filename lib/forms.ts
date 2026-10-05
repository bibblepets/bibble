import type { z } from "zod"

/** Result of a form Server Action, consumed with `useActionState`. A successful action redirects instead. */
export type ActionState<Field extends string = string> = {
	fieldErrors?: Partial<Record<Field, string>>
	formError?: string
	/** Submitted values to put back into the form after an error. Never includes passwords. */
	values?: Partial<Record<Field, string>>
}

/** The first error message for each top-level field. */
export function fieldErrorsFrom<Field extends string>(error: z.ZodError): Partial<Record<Field, string>> {
	const fieldErrors: Partial<Record<Field, string>> = {}
	for (const issue of error.issues) {
		const field = issue.path[0]
		if (typeof field === "string" && !(field in fieldErrors)) {
			fieldErrors[field as Field] = issue.message
		}
	}
	return fieldErrors
}

/** Picks string values for `fields` out of `formData`, skipping files and missing entries. */
export function valuesFrom<Field extends string>(
	formData: FormData,
	fields: readonly Field[]
): Partial<Record<Field, string>> {
	const values: Partial<Record<Field, string>> = {}
	for (const field of fields) {
		const value = formData.get(field)
		if (typeof value === "string") {
			values[field] = value
		}
	}
	return values
}
