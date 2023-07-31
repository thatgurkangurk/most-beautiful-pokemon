import { pokeRouter } from "./pokemon";
import { router } from "./trpc";

export const appRouter = router({
    pokemon: pokeRouter
});

export type AppRouter = typeof appRouter;