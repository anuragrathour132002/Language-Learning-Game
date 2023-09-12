"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react";
import Link from "next/link"


export default function DropdownMenuComp() {
    const { data: session, status } = useSession();
    return (
        <div className="sm:hidden">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Explore</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link href='/quiz'>Explore Quizes</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/leaderboard/language/all">Leaderboard</Link>
                        </DropdownMenuItem>
                        {!session?.user && <DropdownMenuItem>
                            <Link href="/register">Sign in</Link>
                        </DropdownMenuItem>}
                        {session?.user && <DropdownMenuItem>
                            <Link href={`/profile/${session.user.id}`}>Sign in</Link>
                        </DropdownMenuItem>}
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

