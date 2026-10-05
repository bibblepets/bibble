"use client"

import { FormAlert } from "@/components/forms/form-alert"
import { Button } from "@/components/ui/button"
import { createListing } from "@/lib/listings/actions"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { useActionState } from "react"

/** Starts a draft and opens the editor. */
export function CreateListingButton() {
	const [state, action, pending] = useActionState(createListing, {})

	return (
		<form action={action} className="grid gap-2">
			<Button type="submit" disabled={pending} className="h-10 px-4">
				{pending ? <Loader2Icon className="animate-spin" aria-hidden /> : <PlusIcon aria-hidden />}
				Create listing
			</Button>
			<FormAlert message={state.formError} />
		</form>
	)
}
