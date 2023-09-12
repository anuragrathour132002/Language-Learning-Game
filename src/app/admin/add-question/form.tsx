"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Language } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

const formSchema = z.object({
    questionText: z.string().min(2, {
        message: "Question text must be at least 2 characters.",
    }),
    languageId: z.string(),
    options: z.string().optional(),
    correctOptionIndex: z.string(),
    difficulty: z.string(),
});

export default function AddQuestionForm({ languages }: { languages: Language[] }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { toast } = useToast();
    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "⏰ Adding a new Question"
        })

        const res = await fetch('/api/admin/add-question', { method: "POST", body: JSON.stringify({ ...values, options }) })

        if (res.ok) {
            toast({
                title: "✅ Successfully added a new question."
            })
            router.push('/admin')
        }
        else {
            const resj = await res.json();
            toast({
                title: resj.message,
                variant: "destructive"
            })
        }

    }
    const [options, setOptions] = useState<string[]>([])
    return (
        <Card className="pt-5">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="questionText"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Text</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What is German?" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the question.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="options"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Questions options</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Option 1, Option 2, Option 3, Option 4"
                                            {...field}
                                            onChange={(e) => {
                                                setOptions(e.target.value.split(",").map(l => l.trim()))
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Comma (,) separated options
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="correctOptionIndex"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correct Option</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the correct option" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {options.map((op, opIndex) => {
                                                return <SelectItem key={op} value={opIndex.toString()}>{op}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Selecting correct option will reward the user.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="languageId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Language</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a language for quiz" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {languages.map(lang => {
                                                return <SelectItem key={lang.id} value={lang.id.toString()}>{lang.name}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Questions will be selected from specific language.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="difficulty"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Difficulty</FormLabel>
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a difficulty level for question" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map(op => {
                                                return <SelectItem key={op} value={op.toString()}>{op}</SelectItem>
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Questions with more difficulty will hold more score.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
