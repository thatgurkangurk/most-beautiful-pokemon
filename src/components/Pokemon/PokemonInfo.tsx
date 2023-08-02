import { PokemonType } from "@/types/Pokemon"
import { Loader2 } from "lucide-react"
import { FC } from "react"
import Image from 'next/image'

const PokemonInfo: FC<{ pokemon: PokemonType | undefined, isLoading: boolean }> = ({ pokemon, isLoading }) => {
    const capitalize = (str: string) => str?.charAt(0).toUpperCase() + str?.slice(1);;
    const getImageForMon = (mon: number) => `/api/image/${mon}.png`;
    if (isLoading) return <Loader2 className='mr-2 h-16 w-16 animate-spin' />
    return (
        <>
            <h2 className='text-4xl font-bold'>{capitalize(pokemon?.name!)}</h2><div className='relative h-32 w-32'>
                {/** i can use forced true here because i check isLoading above */}
                <Image
                    src={getImageForMon(pokemon?.id!)}
                    alt={pokemon?.name!}
                    layout='fill'
                    objectFit='cover' />
            </div>
        </>
    )
}
export default PokemonInfo