import type { NextPage } from 'next'
import Head from 'next/head'
import Wavy from '@/components/WavyText'
import { VoteButtons } from '@/components/VoteButton'
import { motion } from 'framer-motion'
import { Fade } from '@/anims'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>prettiest pokémon</title>
      </Head>

      {/* Make an either or choice between the 2 pokemon in pokeList */}
      <div className='flex min-h-screen flex-col items-center pt-14'>
        <main className='flex w-full flex-col items-center justify-center px-20 text-center'>
          <Wavy className='pb-2 text-2xl sm:text-4xl md:text-6xl font-bold' text='which pokémon is prettiest?' heading='h1'></Wavy>
          <motion.p variants={Fade} className='italic mb-6 text-gray-500'>{`a "study" ran by gurkan to see which pokémon the internet prefers`}</motion.p>
        </main>
        <VoteButtons />
      </div>
    </>
  )
}

export default Home