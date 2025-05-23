import type { NextComponentType, NextPageContext } from 'next'
import { Session } from 'next-auth'
import type { Router } from 'next/router'

declare module 'next/app' {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P>
    router: Router
    __N_SSG?: boolean
    __N_SSP?: boolean
    pageProps: P & {
      session?: Session
    }
  }
}
