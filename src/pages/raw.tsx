import { NextPage } from 'next'
import Image from 'next/image'
import { trpc } from '../utils/trpc'
import React, { FC, useEffect, useState } from 'react'
import { Vote } from '@prisma/client'
import { useDebounce } from '@/utils/debounce'
import { Loader2 } from 'lucide-react'

// Capitalize first letter of string
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
const getImageForMon = (mon: number) => `/api/image/${mon}.png`;

function useScrollPosition() {
    const [scrollPosition, setScrollPosition] = useState(0);

    function handleScroll() {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

        const scrolled = (winScroll / height) * 100;

        setScrollPosition(scrolled);
    }

    const scrollHandler = useDebounce(handleScroll, 100);

    useEffect(() => {
        window.addEventListener("scroll", scrollHandler, { passive: true });

        return () => {
            window.removeEventListener("scroll", scrollHandler);
        }
    }, [scrollHandler])

    return scrollPosition;
}

const RawVotes: NextPage = () => {
    const scrollPosition = useScrollPosition();
    const { data, hasNextPage, fetchNextPage, isFetching } = trpc.pokemon.getRaw.useInfiniteQuery({
        limit: 30,
    }, {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

    const pokemon = data?.pages.flatMap((page) => page.pokemon) ?? [];

    useEffect(() => {
        if (scrollPosition > 90 && hasNextPage && !isFetching) {
            fetchNextPage()
        }
    }, [scrollPosition, hasNextPage, isFetching, fetchNextPage])

    return (
        <div className='mx-auto flex max-w-5xl flex-col items-center py-12'>
            <h1 className='text-center text-2xl font-bold'>Raw vote data:</h1>
            <ul className='mx-auto grid grid-cols-2 items-center sm:gap-2 place-items-center py-6'>
                <PokemonList pokemon={pokemon} />
            </ul>
            {!hasNextPage && <p>No more votes.</p>}
            {isFetching && <Loader2 className='animate-spin' />}
        </div>
    )
}

const PokemonList: FC<{
    pokemon: {
        id: number;
        votes: Vote[];
        name: string;
    }[] | undefined
}> = ({ pokemon }) => {
    if (pokemon && pokemon[0] === undefined) {
        return <h1>No votes were found...</h1>
    } else return <>
        {pokemon?.map((p) => (
            <li key={p.id} className='flex w-full items-center gap-2'>
                <div className='relative h-12 w-12'>
                    <Image src={getImageForMon(p.id)} layout='fill' alt='pokemon' objectFit='cover' />
                </div>
                <div className='flex flex-col'>
                    <h4>{capitalize(p.name)}</h4>
                    <p className='text-xs text-gray-500'>Votes: {p.votes.length}</p>
                </div>
            </li>
        ))}
    </>
}

export default RawVotes