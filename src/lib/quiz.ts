import { Prisma, Question } from "@prisma/client";
import prisma from "./prisma";


type getQuizParams = {
    quizId: number
    userId: number
}

export const getQuiz = async (params: getQuizParams) => {
    const user = await prisma.user.findUnique({
        where: { id: params.userId }
    })

    const quiz = await prisma.quiz.findUnique({
        where:
        {
            id: params.quizId
        },
        include: {
            results: {
                where: {
                    userId: params.userId
                },
                include: {
                    markedOptions: true,
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            }
        }
    });

    if (quiz?.results.length! > 0) {
        return { ...quiz, result: quiz?.results[0] };
    }

    const questions = await prisma.question.findMany({
        where: {
            languageId: quiz?.languageId,
            difficulty: {
                lte: user?.level
            }
        }
    })
    const shuffledQuestions = questions.sort(() => 0.5 - Math.random())
    const selectedQuestions = shuffledQuestions.splice(0, 5);

    const totalScore = selectedQuestions.reduce((p, c) => p + getScore(c.difficulty), 0)
    const result = await prisma.result.create({
        data: {
            userId: params.userId,
            quizId: params.quizId,
            totalScore,
            questions: {
                connect: selectedQuestions.map(q => ({ id: q.id }))
            }
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            },
            markedOptions: true
        }
    })

    return { ...quiz, result }
}

export type Quiz = Prisma.PromiseReturnType<typeof getQuiz>;

const difficultyScoreMap = new Map<number, number>([[1, 2], [2, 4], [3, 6], [4, 8], [5, 10]]);
export const getScore = (difficulty: number) => {
    return difficultyScoreMap.get(difficulty) ?? 0;
}
