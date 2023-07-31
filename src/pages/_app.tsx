import '@/styles/globals.css'
import { Partytown } from '@builder.io/partytown/react'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>prettiest pokémon</title>
        <Partytown forward={['datalayer.push']} />
      </Head>

      <Script defer data-domain="pokemon.gurkz.me" src="https://analytics.gurkz.me/js/script.tagged-events.js" type="text/partytown"></Script>
      <main className='p-2'>
        <Component {...pageProps} />
      </main>
    </>

  )
}
