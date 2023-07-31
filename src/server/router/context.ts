import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "@/server/db/client";

type CreateContextOptions = Record<string, never>;

export const createContextInner = async (opts: CreateContextOptions) => {
    return {
        prisma,
    }
}

export const createContext = async (
    opts: trpcNext.CreateNextContextOptions
) => {
    return await createContextInner({});
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;