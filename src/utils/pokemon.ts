import { trpc } from "./trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from '@tanstack/react-query';
import { usePlausible } from "next-plausible";

export const useRandomPokemon = () => {
    const query = trpc.pokemon.getRandom.useQuery();
    const queryClient = useQueryClient();
    const queryKey = getQueryKey(trpc.pokemon.getRandom);
    const resetPokemonList = () => {
        queryClient.invalidateQueries(queryKey);
    }
    return { resetPokemonList, ...query }
}

export const useVotePokemon = () => {
    const queryClient = useQueryClient();
    const randomPokemonQuery = useRandomPokemon();
    const plausible = usePlausible();
    const { mutate } = trpc.pokemon.vote.useMutation({
        onSuccess: (_data, _variables, _ctx) => {
            getQueryKey(trpc.pokemon.getRandom)
            queryClient.invalidateQueries()
        }
    })
    const vote = ({ id, imgUrl, name }: { id: number, imgUrl: string, name: string }) => {
        plausible('vote', {
            props: {
                id: id,
                name: name
            }
        })
        mutate({
            id,
            imgUrl,
            name
        });
    };
    const skip = () => {
        plausible('skip');
        randomPokemonQuery.resetPokemonList();
    }
    return { vote, skip }
}