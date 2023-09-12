import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const cards = [{
    title: "Exercises",
    body: "Improve their language proficiency through interactive exercises"
}, {
    title: "Activities",
    body: "Improve their language proficiency through interactive exercises"
}]

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-between px-3 sm:px-24 py-10 sm:py-20">
            <h1 className='text-center  text-4xl sm:text-6xl font-bold'>Learn languages through interactive exercises and activities</h1>
            <h2 className='text-center mt-5 sm:text-lg'>Improve language proficiency, for beginners and even experienced</h2>
            <div className='mt-10 flex gap-5 flex-wrap justify-center'>
                {cards.map((card, cardIdx) => <Card key={cardIdx} className='max-w-[300px]'>
                    <CardHeader>
                        <CardTitle>{card.title}</CardTitle>
                        <CardDescription>{card.body}</CardDescription>
                    </CardHeader>
                </Card>)}
            </div>
            <div className='mt-7'>
                <Button>
                    <Link href="/quiz">Explore Quizes</Link>
                </Button>
            </div>
        </main>
    )
}
