import { redirect } from 'next/navigation'
import QuizForm from "./form";
import { getQuiz } from '@/lib/quiz';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function QuizPage({ params }: { params: { quizId: string } }) {
    const session = await getServerSession(authOptions);
    const quiz = await getQuiz({ quizId: parseInt(params.quizId), userId: session?.user.id });
    const result = quiz?.result?.markedOptions?.length! > 0 ? quiz.result : false;
    if (!quiz) return redirect('/quiz')
    if (!result) {
        quiz.result!.questions = quiz.result!.questions.map(q => {
            return {
                ...q, options: q.options.map(op => ({
                    ...op, correct: false
                }))
            }
        })
    }

    return (
        <main className="flex flex-col items-center justify-between px-2 sm:px-24">
            <h1 className='mt-3 text-center text-4xl font-bold'>{result ? "View Result" : "Take Quiz"}: {quiz?.name}</h1>
            <h2 className='text-center mt-5 text-lg'>{quiz.description}</h2>
            {result && <>
                <h3 className='mt-8 font-bold'>Your result is here!</h3>
                <Card className='w-11/12 sm:w-1/2 mt-6 flex flex-col items-center p-5'>
                    <CardTitle>Congratulations!</CardTitle>
                    <CardDescription className='mt-1'>You scored  {result.score} out of {result.totalScore} points!</CardDescription>
                </Card>
            </>}
            <QuizForm quiz={quiz} />
        </main>
    )
}
