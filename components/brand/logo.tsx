import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

/** Links home. Shows the paw on small screens and the full wordmark from `md` up. */
export function Logo({ className }: { className?: string }) {
	return (
		<Link href="/" aria-label="Bibble home" className={cn("flex shrink-0 items-center", className)}>
			{/* Both images are lazy so only the visible one loads; fetchPriority still front-loads it. */}
			<Image
				src="/brand/logo-small.png"
				alt=""
				width={231}
				height={196}
				fetchPriority="high"
				className="h-8 w-auto md:hidden"
			/>
			<Image
				src="/brand/logo.png"
				alt=""
				width={820}
				height={196}
				fetchPriority="high"
				className="hidden h-8 w-auto md:block"
			/>
		</Link>
	)
}
