import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import { PokemonType } from '@/types/Pokemon'
import Wavy from '@/components/WavyText'
import { motion } from 'framer-motion'
import { Fade } from '@/anims'
import { usePlausible } from 'next-plausible'
import { Loader2 } from 'lucide-react'

const LEADERBOARD_NAV = '/prettiest'
// Capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const Home: NextPage = () => {
  const [pokemonList, setPokemonList] = useState<PokemonType[]>([])
  const plausible = usePlausible();
  const [fetchedEnoughPokemon, setFetchedEnoughPokemon] = useState<boolean>(false)

  const { data: pokemon, refetch } = trpc.pokemon.getRandom.useQuery(undefined, {
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
      <Head>
        <title>prettiest pokémon</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Make an either or choice between the 2 pokemon in pokeList */}
      <div className='flex min-h-screen flex-col items-center justify-center py-2'>
        <main className='flex w-full flex-col items-center justify-center px-20 text-center'>
          <Wavy className='pb-2 text-2xl sm:text-4xl md:text-6xl font-bold' text='which pokémon is prettiest?' heading='h1'></Wavy>
          <motion.p variants={Fade} className='italic mb-6 text-gray-500'>a &quot;study&quot; ran by gurkan to see which pokémon the internet prefers</motion.p>
          <div className='flex min-h-[15rem] items-center'>
            <motion.div variants={Fade} className='relative sm:grid grid-cols-2 gap-4'>
              <PokemonButton fetchedEnoughPokemon={fetchedEnoughPokemon} className='bg-red-400' pokemon={pokemonList[0]} resetPokemon={resetPokemon} />
              <PokemonButton fetchedEnoughPokemon={fetchedEnoughPokemon} className='bg-green-400' pokemon={pokemonList[1]} resetPokemon={resetPokemon} />



              {/* 'OR' seperator */}
              <div className='pointer-events-none absolute inset-0 grid place-items-center'>
                <div className='grid h-12 w-12 place-items-center rounded-full bg-black text-white outline outline-[8px] outline-white'>
                  or
                </div>
              </div>
            </motion.div>
          </div>
          <button onClick={() => resetPokemon()} className='mt-4 p-2 bg-orange-500 rounded-md shadow'>both are ugly</button>
        </main>

        <Link href={LEADERBOARD_NAV} className='pt-12 text-xs underline'>
          See leaderboard
        </Link>
        <Link href="/privacy" className='pt-12 text-xs underline'>
          Privacy Policy
        </Link>
      </div>
    </>
  )
}

const PokemonButton: FC<{ pokemon: PokemonType | undefined, resetPokemon: () => void, className: string, fetchedEnoughPokemon: boolean }> = ({ pokemon, resetPokemon, className: extClassName, fetchedEnoughPokemon }) => {
  const plausible = usePlausible();
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
      <PokemonImage pokemon={pokemon} />
    </button>
  )
}

const PokemonImage: FC<{ pokemon: PokemonType | undefined }> = ({ pokemon }) => {
  if (!pokemon) return <Loader2 className='mr-2 h-16 w-16 animate-spin' />
  return (
    <>
      <h2 className='text-4xl font-bold'>{capitalize(pokemon.name)}</h2>
      <div className='relative h-32 w-32'>

        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          layout='fill'
          objectFit='cover'
        />
      </div>
    </>
  )
}

export default Home