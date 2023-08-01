import { PokemonType } from "@/types/Pokemon"
import { trpc } from "@/utils/trpc"
import { Loader2 } from "lucide-react"
import { usePlausible } from "next-plausible"
import Image from "next/image"
import { FC, useEffect, useState } from "react"
import { atom, useAtom } from 'jotai'
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { Fade } from "@/anims"

const pokemonListAtom = atom<PokemonType[]>([]);
const VoteButtons: FC = () => {
    const [pokemonList, setPokemonList] = useAtom(pokemonListAtom);
    const [fetchedEnoughPokemon, setFetchedEnoughPokemon] = useState<boolean>(false);

    const { data: pokemon, refetch, isLoading } = trpc.pokemon.getRandom.useQuery(undefined, {
        enabled: !fetchedEnoughPokemon, onSuccess(data) {
            setPokemonList((prev) => [...prev, pokemon!])
        }
    })

    useEffect(() => {
        if (pokemonList.length < 2) refetch()
        else setFetchedEnoughPokemon(true)
    }, [pokemonList.length, refetch])

    // Handle reset pokemon
    const resetPokemon = () => {
        setPokemonList([])
    }

    if (!pokemon) return <p>Loading...</p>
    return (
        <>
            <>
                <div className='flex min-h-[15rem] items-center'>
                    <motion.div variants={Fade} className='relative sm:grid grid-cols-2 gap-4'>
                        <VoteButton className="bg-green-400" pokemon={pokemonList[0]} />
                        <VoteButton className="bg-red-400" pokemon={pokemonList[1]} />
                    </motion.div>
                </div>
                <Button variant="destructive" className="" onClick={() => resetPokemon()}>both are ugly</Button>

            </>
        </>
    )
}

const VoteButton: FC<{ pokemon: PokemonType | undefined, className: string }> = ({ pokemon, className: extClassName }) => {
    const [_pokemonList, setPokemonList] = useAtom(pokemonListAtom);
    const plausible = usePlausible();

    // Handle reset pokemon
    const resetPokemon = () => {
        setPokemonList([])
    }

    // Handle pokemon voting
    const { mutate: vote } = trpc.pokemon.vote.useMutation({
        onSuccess: () => {
            resetPokemon()
        },
    })

    // Voting function
    const handleVote = (id: number, imgUrl: string, name: string) => {
        plausible('vote', {
            props: {
                id: id,
                name: name
            }
        })
        vote({ id, imgUrl, name })
    }

    return (
        <button
            type='button'
            onClick={() =>
                handleVote(
                    pokemon!.id,
                    pokemon!.sprites.front_default,
                    pokemon!.name
                )
            }
            className={`rounded-md p-8 shadow w-full grid place-items-center ${extClassName}`}>
            <PokemonInfo pokemon={pokemon} />
        </button>
    )
}

const PokemonInfo: FC<{ pokemon: PokemonType | undefined }> = ({ pokemon }) => {
    // Capitalize first letter of string
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
    if (!pokemon) return <Loader2 className='mr-2 h-16 w-16 animate-spin' />
    return (
        <>
            <h2 className='text-4xl font-bold'>{capitalize(pokemon.name)}</h2><div className='relative h-32 w-32'>
                <Image
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    layout='fill'
                    objectFit='cover' />
            </div>
        </>
    )
}

export { VoteButtons }