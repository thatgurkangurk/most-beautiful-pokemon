import { PokemonType } from "@/types/Pokemon";
import { usePokemon } from "@/utils/pokemon";
import { FC } from "react";
import PokemonInfo from "./PokemonInfo";

const VoteButton: FC<{ pokemon: PokemonType | undefined, className: string, isLoading: boolean }> = ({ pokemon, className: extClassName, isLoading }) => {
    const { vote, } = usePokemon();

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

export { VoteButton }