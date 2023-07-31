import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { trpc } from '../utils/trpc'
import { PokemonType } from '@/types/Pokemon'
import Wavy from '@/components/WavyText'
import { motion } from 'framer-motion'
import { Fade } from '@/anims'
import { usePlausible } from 'next-plausible'

const LEADERBOARD_NAV = '/prettiest'

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

  if (!pokemon) return <p>Loading...</p>

  // Capitalize first letter of string
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <>
      <Head>
        <title>prettiest pokémon</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      {/* Make an either or choice between the 2 pokemon in pokeList */}
      <div className='flex min-h-screen flex-col items-center justify-center py-2'>
        <main className='flex w-full flex-col items-center justify-center px-20 text-center'>
          <Wavy heading='h1' text={'which pokémon is prettiest?'} className='pb-2 text-6xl font-bold' />
          <Wavy heading='p' className='italic mb-6 text-gray-500' text={`a "study" ran by gurkan to see which pokémon the internet prefers`}></Wavy>
          <div className='flex min-h-[15rem] items-center'>
            {pokemonList[0] && pokemonList[1] && (
              <motion.div variants={Fade} className='relative sm:grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    handleVote(
                      pokemonList[0]!.id,
                      pokemonList[0]!.sprites.front_default,
                      pokemonList[0]!.name
                    )
                  }
                  className='rounded-md bg-green-400 p-8 shadow w-full grid place-items-center'>
                  <h2 className='text-4xl font-bold'>{capitalize(pokemonList[0].name)}</h2>
                  <div className='relative h-32 w-32'>
                    <Image
                      src={pokemonList[0].sprites.front_default}
                      alt={pokemonList[0].name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </button>

                <button
                  type='button'
                  onClick={() =>
                    handleVote(
                      pokemonList[1]!.id,
                      pokemonList[1]!.sprites.front_default,
                      pokemonList[1]!.name
                    )
                  }
                  className='rounded-md bg-red-400 p-8 shadow w-full grid place-items-center'>
                  <h2 className='text-4xl font-bold'>{capitalize(pokemonList[1].name)}</h2>
                  <div className='relative h-32 w-32'>
                    <Image
                      src={pokemonList[1].sprites.front_default}
                      alt={pokemonList[1].name}
                      layout='fill'
                      objectFit='cover'
                    />
                  </div>
                </button>

                {/* 'OR' seperator */}
                <div className='pointer-events-none absolute inset-0 grid place-items-center'>
                  <div className='grid h-12 w-12 place-items-center rounded-full bg-black text-white outline outline-[8px] outline-white'>
                    or
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        <Link href={LEADERBOARD_NAV} className='pt-12 text-xs underline'>
          See leaderboard
        </Link>
      </div>
    </>
  )
}

export default Home