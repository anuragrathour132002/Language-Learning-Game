"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { Language, Quiz } from "@prisma/client";
import { Badge } from "@/components/ui/badge"


export default function Dashboard({ languages, quizes }: { languages: Language[], quizes: any[] }) {
    const [languageId, setLanguageId] = useState<number>(-1)
    return <div className="mt-8">
        <div className="w-full flex gap-x-4 justify-center items-center">
            <span className="text-sm">Select Language</span>
            <Select onValueChange={(v) => setLanguageId(parseInt(v))}>
                <SelectTrigger className="w-1/3 sm:w-[180px]">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent><SelectItem value={"-1"}>All</SelectItem>
                    {languages.map(lang => {
                        return <SelectItem key={`lang-select-item-${lang.id}`} value={lang.id.toString()}>{lang.name}</SelectItem>
                    })}
                </SelectContent>
            </Select>
        </div>
        <div className='mt-6 flex gap-5 flex-wrap items-center justify-center'>
            {quizes.filter(q => languageId === -1 || q.language.id === languageId).map((quiz) => <Card key={`quiz-${quiz.id}`} className='sm:min-w-[350px]'>
                <CardHeader className=''>
                    <CardTitle>{quiz.name}</CardTitle>
                    <CardDescription>{quiz.description}<br />
                    </CardDescription>
                    <Badge variant={'outline'} className="w-fit">Language: {quiz.language.name}</Badge>
                </CardHeader>
                <CardContent>
                </CardContent>
                <CardFooter className='flex gap-x-4'>
                    <Button>
                        <Link href={`/quiz/${quiz.id}`}>{(quiz.results.length === 0 || quiz.results[0]?.markedOptions.length === 0) ? "Start Quiz" : "View Result"}</Link>
                    </Button>
                    <Link href={`leaderboard/quiz/${quiz.id}`} className='text-sm underline'>View leaderboard</Link>
                </CardFooter>
            </Card>)}
        </div>
    </div>
}
