"use client"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function SelectLanguage({ languages, currentLanguage }: { languages: { id: number, name: string }[], currentLanguage: string }) {
    const router = useRouter()
    return <div className="flex gap-x-4 items-center mt-4">
        <span className="text-sm">Go to langage specific leaderboard</span>
        <Select defaultValue={currentLanguage} onValueChange={(v) => {
            router.push(v)
        }}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={"all"}>All</SelectItem>
                {languages.map(lang => {
                    return <SelectItem key={`lang-select-item-${lang.id}`} value={lang.name.toLowerCase()}>{lang.name}</SelectItem>
                })}
            </SelectContent>
        </Select>
    </div>


}
