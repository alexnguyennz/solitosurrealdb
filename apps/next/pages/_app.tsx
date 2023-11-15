import 'raf/polyfill'
import 'setimmediate'

import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'

import { Provider } from 'app/provider'

import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Solito + SurrealDB</title>
      </Head>
      <Provider>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </Provider>
    </>
  )
}

export default MyApp
