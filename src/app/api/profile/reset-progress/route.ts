import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "User not logged in."
            })
        }

        await prisma.result.deleteMany({
            where: {
                userId: session?.user.id
            }
        })
        return NextResponse.json({});
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Error occurred."
        }, {
            status: 500
        })
    }
}
