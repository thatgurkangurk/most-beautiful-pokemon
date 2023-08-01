import { FC } from "react"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { Fade } from "@/anims"
import { usePokemon } from "@/utils/pokemon"
import { VoteButton } from "./VoteButton"

const VoteButtons: FC = () => {
    const { data: pokemonList, isFetching, skip } = usePokemon();

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





export { VoteButtons }