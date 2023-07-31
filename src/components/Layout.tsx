import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';
import { ReactNode } from 'react';
import { Providers } from './Providers';

type LayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: LayoutProps) => {
    return (
        <>
            <Providers>
                <Head>
                    <title>prettiest pokémon</title>
                </Head>
                <main className='p-2'>
                    {children}
                </main>
                {process.env.NODE_ENV !== 'production' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </Providers>
        </>
    );
};