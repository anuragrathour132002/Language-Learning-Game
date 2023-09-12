import prisma from "@/lib/prisma";
import AddQuestionForm from "./form";

export default async function AddQuizPage() {
    const languages = await prisma.language.findMany({});

    return <main className="flex flex-col items-center justify-between px-24 py-20">
        <h1 className="mb-10 font-bold text-2xl">Add Question</h1>
        <AddQuestionForm languages={languages} />
    </main>
}
