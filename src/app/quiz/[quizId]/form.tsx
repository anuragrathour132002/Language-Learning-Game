"use client"
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Quiz, getScore } from "@/lib/quiz";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

const formObj: any = {}
export default function QuizForm({ quiz }: { quiz: Quiz }) {
    const router = useRouter();

    useEffect(() => {
        quiz.result?.questions.forEach(q => {
            formObj[q.id.toString()] = z.enum(q.options.map(op => op.id.toString()))
        })
    }, [quiz])

    const FormSchema = z.object(formObj)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const { toast } = useToast()
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        toast({
            title: "⏰ Submitting",
            description: "Saving your response.",
        })
        const res = await fetch(`/api/quiz/submit/${quiz?.id}`, { method: "POST", body: JSON.stringify(data) })

        if (res.ok) {
            router.refresh();
            toast({
                title: "✅ Done",
                description: "You can now view your score",
            })
        }
    }

    return <div className='mt-10 flex gap-5 flex-wrap sm:w-1/2'>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 flex flex-col">
                {quiz?.result?.questions.map((question, questionIndex) => {
                    const markedOption = quiz.results.length > 0 && quiz.results?.[0].markedOptions.find(op => op.questionId === question.id) || null
                    return <FormField
                        key={`question-${question.id}`}
                        control={form.control}
                        name={question.id.toString()}
                        render={({ field }) => (
                            <FormItem className="space-y-3 border p-6 rounded">
                                <FormLabel className="flex justify-between"><span>{questionIndex + 1}. {question.text}</span> <span className="text-sm text-zinc-500">{getScore(question.difficulty)} points</span></FormLabel>
                                <FormControl>
                                    <RadioGroup disabled={quiz.result?.score! > 0}
                                        onValueChange={field.onChange}
                                        defaultValue={markedOption?.id.toString()}
                                        className="flex flex-col space-y-1"
                                    >
                                        {question.options.map(option => {
                                            return <FormItem key={`option-${option.id}`} className={`flex p-3 rounded border items-center space-x-3 space-y-0 ${option.correct && `border-green-900 bg-green-200`} ${option.id === markedOption?.id && !markedOption?.correct && `bg-red-500`}`}>
                                                <FormControl>
                                                    <RadioGroupItem value={option.id.toString()} />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {option.text}
                                                </FormLabel>
                                            </FormItem>
                                        })}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                })}
                {quiz.result?.markedOptions.length === 0 && <Button className="w-1/2 mx-auto" type="submit">Submit</Button>}
            </form>
        </Form>
    </div>
}
