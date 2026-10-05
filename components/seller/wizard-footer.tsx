import { Button, buttonVariants } from "@/components/ui/button"
import { wizardSteps, type WizardStep } from "@/lib/sellers/progress"
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"

type Next = { kind: "submit"; formId: string; pending?: boolean } | { kind: "link"; href: string; disabled?: boolean }

type WizardFooterProps = { step: WizardStep; next: Next; nextLabel?: string }

function backHref(step: WizardStep): string {
	const index = wizardSteps.indexOf(step)
	return index === 0 ? "/seller/onboarding" : `/seller/onboarding/${wizardSteps[index - 1]}`
}

const nextClassName = "h-12 rounded-lg px-6 text-base"

/**
 * Fixed footer bar with progress, Back and Next. A labelled nav rather than <footer>, which isn't a landmark inside
 * <main>. Rendered inside each step's form so Next can submit it.
 */
export function WizardFooter({ step, next, nextLabel = "Next" }: WizardFooterProps) {
	const current = wizardSteps.indexOf(step) + 1

	return (
		<nav aria-label="Steps" className="bg-background fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]">
			<div
				role="progressbar"
				aria-label={`Step ${current} of ${wizardSteps.length}`}
				aria-valuemin={1}
				aria-valuemax={wizardSteps.length}
				aria-valuenow={current}
				className="flex gap-1.5"
			>
				{wizardSteps.map((s, index) => (
					<div key={s} className={cn("h-1.5 flex-1", index < current ? "bg-foreground" : "bg-muted")} />
				))}
			</div>
			<div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
				<Link href={backHref(step)} className="text-base font-semibold underline underline-offset-4">
					Back
				</Link>
				{next.kind === "submit" ? (
					<Button
						type="submit"
						form={next.formId}
						disabled={next.pending}
						aria-busy={next.pending || undefined}
						className={nextClassName}
					>
						{next.pending && <Loader2Icon className="animate-spin" aria-hidden />}
						{nextLabel}
					</Button>
				) : next.disabled ? (
					<Button disabled className={nextClassName}>
						{nextLabel}
					</Button>
				) : (
					<Link href={next.href} className={cn(buttonVariants(), nextClassName)}>
						{nextLabel}
					</Link>
				)}
			</div>
		</nav>
	)
}
