import DeleteProgress from "./deleteProgress";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export function Settings() {
    return <div className="w-full mt-20 flex flex-col items-center">
        <h3 className="text-xl font-bold">Account settings</h3>
        <Card className="mt-5 md:w-1/2">
            <CardTitle className="text-center my-5">Destructive</CardTitle>
            <CardContent className="flex gap-x-4 items-center justify-center">
                Want to reset your progress? <DeleteProgress />
            </CardContent>
        </Card>
    </div>
}
