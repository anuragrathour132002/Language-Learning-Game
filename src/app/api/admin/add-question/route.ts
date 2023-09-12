import prisma from "@/lib/prisma"
import { NextResponse, NextRequest } from "next/server"

type Body = {
    questionText: string;
    languageId: string;
    options: string[],
    correctOptionIndex: string;
    difficulty: string,
}

export const POST = async (req: NextRequest) => {
    try {
        const body: Body = await req.json();
        if (body.options.length !== 4) return NextResponse.json({ message: "4 options are required" }, { status: 400 })

        await prisma.question.create({
            data: {
                text: body.questionText,
                difficulty: parseInt(body.difficulty),
                languageId: parseInt(body.languageId),
                options:
                {
                    create: body.options.map(op => ({
                        text: op,
                        correct: op === body.options[parseInt(body.correctOptionIndex)]
                    }))
                }
            }

        })

        return NextResponse.json({
            success: true
        })
    } catch (err) {
        return NextResponse.json({
            success: false,
            message: "Error occurred."
        }, {
            status: 500
        })
    }


}
