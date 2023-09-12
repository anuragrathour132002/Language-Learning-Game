import AddLanguageForm from "./form";

export default async function AddQuizPage() {
    return <main className="flex flex-col items-center justify-between px-24 py-20">
        <h1 className="mb-10 font-bold text-2xl">Add Language</h1>
        <AddLanguageForm />
    </main>
}
