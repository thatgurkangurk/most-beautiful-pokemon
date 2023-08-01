import { PokemonType } from "@/types/Pokemon"
import { trpc } from "@/utils/trpc"
import { Loader2 } from "lucide-react"
import { usePlausible } from "next-plausible"
import Image from "next/image"
import { FC, useEffect } from "react"
import { atom, useAtom } from 'jotai'
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { Fade } from "@/anims"

const pokemonListAtom = atom<PokemonType[]>([]);
const fetchedEnoughPokemonAtom = atom<boolean>(false);
const VoteButtons: FC = () => {
    const plausible = usePlausible();
    const [pokemonList, setPokemonList] = useAtom(pokemonListAtom);
    const [fetchedEnoughPokemon, setFetchedEnoughPokemon] = useAtom(fetchedEnoughPokemonAtom);

    const { data: pokemon, refetch, isFetching } = trpc.pokemon.getRandom.useQuery(undefined, {
        enabled: !fetchedEnoughPokemon, onSuccess(data) {
            setPokemonList((prev) => [...prev, data])
        }
    })

    useEffect(() => {
        if (pokemonList.length < 2) refetch()
        else setFetchedEnoughPokemon(true)
    }, [pokemonList.length, refetch, setFetchedEnoughPokemon])

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
                        <VoteButton className="bg-green-400" pokemon={pokemonList[0]} isLoading={isFetching} />
                        <VoteButton className="bg-red-400" pokemon={pokemonList[1]} isLoading={isFetching} />
                    </motion.div>
                </div>
                <Button variant="destructive" className="" onClick={() => {
                    plausible('skip');
                    resetPokemon();
                }}>both are ugly</Button>

            </>
        </>
    )
}

const VoteButton: FC<{ pokemon: PokemonType | undefined, className: string, isLoading: boolean }> = ({ pokemon, className: extClassName, isLoading }) => {
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
            <PokemonInfo pokemon={pokemon} isLoading={isLoading} />
        </button>
    )
}

const PokemonInfo: FC<{ pokemon: PokemonType | undefined, isLoading: boolean }> = ({ pokemon, isLoading }) => {
    // Capitalize first letter of string
    const capitalize = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1)
    if (isLoading) return <Loader2 className='mr-2 h-16 w-16 animate-spin' />
    return (
        <>
            <h2 className='text-4xl font-bold'>{capitalize(pokemon?.name!)}</h2><div className='relative h-32 w-32'>
                {/** i can use forced true here because i check isLoading above */}
                <Image
                    src={pokemon?.sprites.front_default!}
                    alt={pokemon?.name!}
                    layout='fill'
                    objectFit='cover' />
            </div>
        </>
    )
}

export { VoteButtons }