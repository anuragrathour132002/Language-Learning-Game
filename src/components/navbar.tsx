"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import DropdownMenu from "./navmenu";

const Nav = () => {
    const { data: session, status } = useSession();

    return (
        <nav className="flex justify-between items-center py-6 px-10">
            <Link href="/" className="font-bold text-xl">
                LangLearn
            </Link>
            <DropdownMenu />
            <div className="hidden sm:flex gap-x-8 text-sm font-semibold">
                <Link href="/quiz">Explore quizes</Link>
                <Link href="/leaderboard/language/all">Leaderboard</Link>
                {!session?.user && <Link href="/register">Sign in</Link>}
                {session?.user && (
                    <>
                        <Link href={`/profile/${session.user.id}`} prefetch={false} >
                            View profile
                        </Link>
                        <button
                            onClick={() => {
                                signOut();
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Nav;
