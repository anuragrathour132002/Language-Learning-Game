import Nav from '@/components/navbar'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Provider from '@/context/auth-context'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'LearnLang',
    description: 'Learn languages through interactive exercises and activities',
}

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    return (
        <html lang="en">
            <Provider session={session}>
                <body className={`min-h-screen ${inter.className}`}>
                    <Nav />
                    {children}
                    <Toaster />
                </body>
            </Provider>
        </html>
    )
}
