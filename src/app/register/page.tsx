"use client"
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { signIn } from "next-auth/react"
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Enter valid email"
    }),
    name: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(3, {
        message: "Password must be at least 3 characters."
    })
})

export default function RegisterPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        toast({
            title: "⏰ Welcome",
            description: "Creating your new account",
        })
        const res = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(values)
        })

        if (res.ok) {
            // success
            toast({
                title: "✅ Signing you in.",
                description: "Begin your quizes.",
            })
            signIn('credentials', { redirect: true, ...values })
        }
    }
    return (
        <main className="flex flex-col items-center justify-between px-3 sm:px-24 py-10 sm:py-12">
            <h1 className='text-center text-3xl font-bold'>Register</h1>
            <h2 className='mt-5 text-center'>Improve language proficiency, for beginners and even experienced</h2>
            <div className='mt-7 md:w-1/3 p-8 border rounded'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Tanmay" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="tanmay@gmail.com" type="email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="" type="password" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-x-3">
                            <Button type="submit">Create Account</Button>
                            <button className="text-sm underline text-zinc-500" onClick={() => { signIn() }}>Sign in instead</button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>
    )
}
