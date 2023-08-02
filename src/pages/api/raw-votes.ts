import { prisma } from "@/server/db/client";
import { NextApiResponse } from "next";

export async function getRawVotes() {
    const pokemon = await prisma.pokemon.findMany({
        orderBy: {
            votes: {
                _count: 'desc'
            }
        },
        select: {
            id: true,
            name: true,
            votes: true
        }
    });

    return pokemon;
}

export default async function handler(
    res: NextApiResponse
) {
    const raw = await getRawVotes();
    res.status(200).json(raw)
}