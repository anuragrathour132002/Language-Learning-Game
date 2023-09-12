import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function AdminPage() {
    return <main className="flex flex-col items-center justify-between px-24 py-20">
        <div className="w-full flex flex-col items-center gap-y-6">
            <Link href="/admin/add-quiz" className="w-1/3">
                <Card className="p-4 px-4">
                    <CardTitle className="text-center text-xl">Add Quiz</CardTitle>
                    <CardDescription className="text-center">Add Quizes for different languages</CardDescription>
                </Card>
            </Link>
            <Link href="/admin/add-language" className="w-1/3" >
                <Card className="p-4 px-4">
                    <CardTitle className="text-center text-xl">Add Language</CardTitle>
                    <CardDescription className="text-center">Add selectable languages for users</CardDescription>
                </Card>
            </Link>
            <Link href="/admin/add-question" className="w-1/3">
                <Card className="p-4 px-4">
                    <CardTitle className="text-center text-xl">Add Question</CardTitle>
                    <CardDescription className="text-center">Add language specific questions</CardDescription>
                </Card>
            </Link>
        </div>
    </main>
}
