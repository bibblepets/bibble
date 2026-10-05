import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import type { ReactNode } from "react"

/** Full-width primary submit button that shows a spinner while the action runs. */
export function SubmitButton({ pending, children }: { pending: boolean; children: ReactNode }) {
	return (
		<Button
			type="submit"
			size="lg"
			disabled={pending}
			aria-busy={pending || undefined}
			className="h-11 w-full text-base"
		>
			{pending && <Loader2Icon className="animate-spin" aria-hidden />}
			{children}
		</Button>
	)
}
