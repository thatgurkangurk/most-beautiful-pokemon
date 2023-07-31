import { trpc } from "@/utils/trpc"
import Head from "next/head"

export default function Home() {
  const { data } = trpc.pokemon.getRandom.useQuery();
  return (
    <>
      <Head>
        <title>prettiest pokémon - home</title>
      </Head>
      <main>
        <h1>work in progress...</h1>
        <p>random pokemon: {data?.name}</p>
      </main>
    </>
  )
}
