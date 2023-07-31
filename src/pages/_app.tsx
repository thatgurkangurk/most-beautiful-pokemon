"use client"
import '@fontsource/barlow'
import '@/styles/globals.css'
import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import { DefaultLayout } from '@/components/Layout';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = (({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter();
  const pageKey = router.asPath;
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>);

  return getLayout(<Component key={pageKey} {...pageProps} />);
}) as AppType;

export default trpc.withTRPC(App);