"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ResultTable = {
    rank: number
    score: number
    user: string
}

export const columns: ColumnDef<ResultTable>[] = [
    {
        accessorKey: "rank",
        header: "Rank",
    },
    {
        accessorKey: "user",
        header: "User",
    },
    {
        accessorKey: "score",
        header: "Score",
    },
]

