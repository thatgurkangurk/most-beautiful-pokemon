import { NextPage } from 'next'
import Image from 'next/image'
import { trpc } from '../utils/trpc'
import { FC } from 'react'

// Capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const Prettiest: NextPage = () => {
    const { data: pokemon } = trpc.pokemon.getPrettiest.useQuery();

    return (
        <div className='mx-auto flex max-w-5xl flex-col items-center py-12'>
            <h1 className='text-center text-2xl font-bold'>The currently most popular pokémon:</h1>
            <ul className='mx-auto grid w-1/2 grid-cols-2 place-items-center py-6'>
                <PokemonList pokemon={pokemon} />
            </ul>
        </div>
    )
}

const PokemonList: FC<{
    pokemon: {
        id: number;
        votes: number;
        imgUrl: string;
        name: string;
    }[] | undefined
}> = ({ pokemon }) => {
    if (pokemon && pokemon[0] === undefined) {
        return <h1>No votes were found...</h1>
    } else return <>
        {pokemon?.map((p) => (
            <li key={p.id} className='flex w-full items-center gap-2'>
                <div className='relative h-12 w-12'>
                    <Image src={p.imgUrl} layout='fill' alt='pokemon' objectFit='cover' />
                </div>
                <div className='flex flex-col'>
                    <h4>{capitalize(p.name)}</h4>
                    <p className='text-xs text-gray-500'>Votes: {p.votes}</p>
                </div>
            </li>
        ))}
    </>
}

export default Prettiest