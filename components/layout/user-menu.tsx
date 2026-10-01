"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuIcon, UserIcon } from "lucide-react"
import Link from "next/link"
import { navLinks } from "./nav-links"

/** Airbnb-style menu button with an avatar. Signed-out items only until auth lands. */
export function UserMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Open menu"
				className="focus-visible:ring-ring/50 flex items-center gap-2 rounded-full border py-1 pr-1 pl-3 transition-shadow outline-none hover:shadow-md focus-visible:ring-3 aria-expanded:shadow-md"
			>
				<MenuIcon className="size-4" aria-hidden />
				<Avatar size="sm">
					<AvatarFallback>
						<UserIcon className="size-4" aria-hidden />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuItem render={<Link href={navLinks.signUp} />} className="font-semibold">
					Sign up
				</DropdownMenuItem>
				<DropdownMenuItem render={<Link href={navLinks.logIn} />}>Log in</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem render={<Link href={navLinks.becomeSeller} />}>Become a seller</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
