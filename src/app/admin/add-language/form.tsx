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
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
    languageName: z.string().min(2, {
        message: "Language name must be at least 2 characters.",
    }),
});

export default function AddLanguageForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const { toast } = useToast();
    const router = useRouter()

    async function onSubmit(values: z.infer<typeof formSchema>) {
        toast({
            title: "⏰ Adding a new language"
        })

        const res = await fetch('/api/admin/add-language', { method: "POST", body: JSON.stringify(values) })
        if (res.ok) {
            toast({
                title: "✅ Successfully added a new language."
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
                            name="languageName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Language Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Arabic" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is the public language name.
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
