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

const formSchema = z.object({
    quizName: z.string().min(2, {
        message: "Quiz name must be at least 2 characters.",
    }),
    languageId: z.string(),
    description: z.string(),
});

export function AddQuizForm({ languages }: { languages: Language[] }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { toast } = useToast();
    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "⏰ Adding a new quiz"
        })

        const res = await fetch('/api/admin/add-quiz', { method: "POST", body: JSON.stringify(values) })

        if (res.ok) {
            toast({
                title: "✅ Successfully added a new quiz."
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
    return (
        <Card className="pt-5">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quizName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quiz Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="German Quiz 1" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the public quiz name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quiz Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Fun beginner level quiz 🎉"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        This will be show to the users on home page.
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
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
