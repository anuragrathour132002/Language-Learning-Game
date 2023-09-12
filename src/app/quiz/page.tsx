import prisma from "@/lib/prisma";
import Dashboard from "./dashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function QuizesPage() {
    const session = await getServerSession(authOptions);

    const [quizes, languages] = await Promise.all([
        prisma.quiz.findMany({
            include: {
                results: {
                    where: {
                        userId: session?.user.id,
                    },
                    include: {
                        markedOptions: true,
                    },
                },
                language: true,
            },
        }),
        prisma.language.findMany(),
    ]);

    return (
        <main className="flex flex-col items-center justify-between px-3 sm:px-24">
            <h1 className="mt-3 text-center text-4xl font-bold">Take Quizes</h1>
            <h2 className="mt-5 text-center sm:text-lg">
                Explore set of available quizes to improve language proficiency
            </h2>
            <Dashboard languages={languages} quizes={quizes} />
        </main>
    );
}
