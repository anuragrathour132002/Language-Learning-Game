"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export default function DeleteProgress() {
    const router = useRouter()

    const { toast } = useToast();

    const handleDeleteProgress = async () => {
        toast({
            title: "⏰ Deleting your progress",
            description: "Removing your results from our servers",
        })

        const res = await fetch('/api/profile/reset-progress', {
            method: 'DELETE'
        })

        if (res.ok) {
            toast({
                title: "✅ Removed your results",
                description: "You can now start from scratch.",
            })

            // Success
            router.refresh()
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">Reset Progress</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your quizes results and progress.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteProgress} className="bg-red-600 hover:bg-red-700">
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

