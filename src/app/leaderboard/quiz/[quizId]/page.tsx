import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { DataTable } from './data-table'
import { columns } from './columns'

export default async function QuizLeaderboardPage({ params }: { params: { quizId: string } }) {
    const quiz = await prisma.quiz.findUnique({
        where: {
            id: parseInt(params.quizId)
        }
    })
    const results = await prisma.result.findMany({
        where: {
            quizId: parseInt(params.quizId),
            markedOptions: {
                some: {}
            }
        },
        include: {
            user: true,
        }
    })

    const tableResults = results.sort((a, b) => b.score! - a.score!).map((r, ri) => ({ rank: ri + 1, id: r.id, score: r.score ?? 0, user: r.user.name }))
    return (
        <main className="flex flex-col items-center justify-between px-3 sm:px-24 py-10 s:py-20">
            <h1 className='text-center text-3xl font-bold'>Leaderboard for {quiz?.name}</h1>
            <h2 className='mt-5 text-center sm:text-lg'>Climb the leaderboard with more practice</h2>
            <div className='flex justify-center w-full mt-5'>
                <DataTable columns={columns} data={tableResults} />
            </div>
            <div className='mt-7'>
                <Button>
                    <Link href="/quiz">Explore Quizes</Link>
                </Button>
            </div>
        </main>
    )
}
