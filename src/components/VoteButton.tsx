import { PokemonType } from "@/types/Pokemon"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { FC } from "react"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { Fade } from "@/anims"
import { useRandomPokemon, useVotePokemon } from "@/utils/pokemon"

const VoteButtons: FC = () => {
    const { data: pokemonList, isFetching } = useRandomPokemon();
    const { skip } = useVotePokemon();

    if (!pokemonList) return <p>Loading...</p>

    return (
        <>
            <>
                <div className='flex min-h-[15rem] items-center'>
                    <motion.div variants={Fade} className='relative sm:grid grid-cols-2 gap-4'>
                        <VoteButton className="bg-green-400" pokemon={pokemonList[0]} isLoading={isFetching} />
                        <VoteButton className="bg-red-400" pokemon={pokemonList[1]} isLoading={isFetching} />
                    </motion.div>
                </div>
                <Button variant="destructive" className="" onClick={() => skip()}>both are ugly</Button>

            </>
        </>
    )
}

const VoteButton: FC<{ pokemon: PokemonType | undefined, className: string, isLoading: boolean }> = ({ pokemon, className: extClassName, isLoading }) => {
    const { vote } = useVotePokemon();

    return (
        <button
            type='button'
            onClick={() =>
                vote({ id: pokemon!.id, imgUrl: pokemon!.sprites.front_default, name: pokemon!.name })
            }
            className={`rounded-md p-8 shadow w-full grid place-items-center ${extClassName}`}>
            <PokemonInfo pokemon={pokemon} isLoading={isLoading} />
        </button>
    )
}

const PokemonInfo: FC<{ pokemon: PokemonType | undefined, isLoading: boolean }> = ({ pokemon, isLoading }) => {
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