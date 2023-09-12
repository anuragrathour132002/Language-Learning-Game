import { Button } from '@/components/ui/button'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { DataTable } from './data-table'
import { columns } from './columns'
import SelectLanguage from './languageSelect'

export default async function LanguageLeaderboardPage({ params }: { params: { languageName: string } }) {
    const languages = await prisma.language.findMany();
    const group = await prisma.result.groupBy({
        by: ['userId'],
        where: params.languageName === 'all' ? {
            markedOptions: {
                some: {}
            }
        } : {
            quiz: {
                language: {
                    name: {
                        in: [params.languageName, params.languageName.charAt(0).toUpperCase() + params.languageName.slice(1)],
                    }
                }
            },
            markedOptions: {
                some: {}
            }
        },
        _sum: {
            score: true
        }
    })
    const userIdNameMap = new Map<number, string>();

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: group.map(g => (
                    g.userId
                ))
            }
        }
    })
    users.forEach(user => userIdNameMap.set(user.id, user.name))
    const groupWithUser = group.map(g => ({ ...g, username: userIdNameMap.get(g.userId) }))
    const tableResults = groupWithUser.sort((a, b) => b._sum.score! - a._sum.score!).map((r, ri) => ({ rank: ri + 1, totalscore: r._sum?.score ?? 0, username: r.username! }))

    return (
        <main className="flex flex-col items-center justify-between px-3 sm:px-24 py-10 sm:py-20">
            <h1 className='text-center text-3xl font-bold'>Leaderboard for {params.languageName.charAt(0).toUpperCase() + params.languageName.slice(1)} {params.languageName === "all" && "languages"}</h1>
            <h2 className='mt-5 text-center text-lg'>Climb the leaderboard with more practice</h2>
            <SelectLanguage languages={languages} currentLanguage={params.languageName} />
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
