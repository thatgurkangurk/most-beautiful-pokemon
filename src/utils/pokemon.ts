import { trpc } from "./trpc";
import { getQueryKey } from "@trpc/react-query";
import { useQueryClient } from '@tanstack/react-query';
import { usePlausible } from "next-plausible";

const usePokemon = () => {
    const plausible = usePlausible();
    const queryClient = useQueryClient();
    const randomPokemonQuery = trpc.pokemon.getRandom.useQuery();
    const queryKey = getQueryKey(trpc.pokemon.getRandom);

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
        resetPokemonList();
    };
    const resetPokemonList = () => {
        queryClient.invalidateQueries(queryKey);
    };

    return { skip, vote, resetPokemonList, ...randomPokemonQuery }
}

export { usePokemon }