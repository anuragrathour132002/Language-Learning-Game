import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getScore } from "@/lib/quiz";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, context: any) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({
                success: false,
                message: "User not logged in."
            })
        }
        const params = context.params;
        const quizId = parseInt(params.quizId);
        const userId = session?.user.id;
        const body: { [key: number]: string } = await request.json()
        const selectedOptionIds = Object.values(body).map(v => parseInt(v))

        const result = await prisma.result.update({
            where: {
                quizId_userId: { quizId, userId }
            },
            data: {
                markedOptions: {
                    connect: selectedOptionIds.map(opId => {
                        return { id: opId }
                    })
                },
                score: 0,
                user: {
                    connect: { id: userId }
                }, quiz: {
                    connect: { id: quizId }
                }
            },
            include: {
                markedOptions: {
                    include: {
                        question: true
                    }
                }, user: true
            }
        })
        const score = result?.markedOptions.reduce((p, c) => p + (c.correct ? getScore(c.question.difficulty) : 0), 0)
        const level = Math.ceil(1 + (score / result.totalScore) * 5) ?? 1;
        await prisma.result.update({
            where: { id: result!.id }, data: {
                score: score
            }
        })
        if (level > result.user.level) {
            await prisma.user.update({
                where: {
                    id: userId
                }
                , data: {
                    level: level
                }
            })
        }
        return NextResponse.json({ success: true, resultId: result.id })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Error occurred."
        }, {
            status: 500
        })
    }

}
