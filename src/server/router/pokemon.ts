import { PokemonType } from "@/types/Pokemon";
import { baseProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getRawVotes } from "@/pages/api/raw-votes";

// get random pokemon id (max id is 1010)
const getRandomPokemonID = () => Math.floor(Math.random() * 1009);

// limit the ID to be 1 through 1010
const limitPokemonID = (id: number) => Math.max(1, Math.min(1009, id));

export const pokeRouter = router({
    getRandom: baseProcedure.query(async () => {
        const pokemonList: PokemonType[] = [];
        while (pokemonList.length < 2) {
            const id = limitPokemonID(getRandomPokemonID());
            const uri = `https://pokeapi.co/api/v2/pokemon/${id}`;
            const res = await fetch(uri);
            const pokemon = (await res.json()) as PokemonType;
            pokemonList.push(pokemon);
        }

        try {
            return pokemonList
        } catch (err) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: (err as any).message,
            })
        }
    }),
    vote: baseProcedure.input(
        z.object({
            id: z.number(),
            imgUrl: z.string(),
            name: z.string()
        })
    ).mutation(async ({ input, ctx }) => {
        await ctx.prisma.pokemon.upsert({
            where: {
                id: input.id
            },
            create: {
                id: input.id,
                votes: {
                    create: {}
                },
                imgUrl: input.imgUrl,
                name: input.name
            },
            update: {
                votes: {
                    create: {}
                }
            }
        })
    }),
    getPrettiest: baseProcedure.query(async ({ ctx }) => {
        const pokemon = await ctx.prisma.pokemon.findMany({
            take: 20,
            orderBy: {
                votes: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                votes: true,
                name: true,
                imgUrl: true
            }
        })

        return pokemon;
    }),
    getRaw: baseProcedure.query(async () => {
        return await getRawVotes();
    })
})