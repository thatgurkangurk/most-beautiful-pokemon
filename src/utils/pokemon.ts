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
        onMutate: () => {
            getQueryKey(trpc.pokemon.getRandom)
            queryClient.invalidateQueries()
        }
    })
    const vote = ({ id, imgUrl, name }: { id: number, imgUrl: string, name: string }) => {
        mutate({
            id,
            imgUrl,
            name
        });
        plausible('vote', {
            props: {
                id: id,
                name: name
            }
        })
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