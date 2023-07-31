import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';
import { ReactNode } from 'react';
import { Providers } from './Providers';
import { motion } from 'framer-motion';
import { FadeContainer } from '@/anims';
import { useRouter } from 'next/router';

type LayoutProps = { children: ReactNode };

export const DefaultLayout = ({ children }: LayoutProps) => {
    const router = useRouter();
    return (
        <>
            <Providers>
                <Head>
                    <title>prettiest pokémon</title>
                </Head>
                <motion.div key={router.route} initial="initial" animate="animate" variants={{
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    }
                }}>
                    <motion.main variants={FadeContainer} initial="hidden" animate="visible" className='p-2'>
                        {children}
                    </motion.main>
                </motion.div>
                {process.env.NODE_ENV !== 'production' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </Providers>
        </>
    );
};