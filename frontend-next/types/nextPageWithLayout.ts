import { NextPage } from 'next'
import { FC, ReactElement, ReactNode } from 'react'

export type NextPageWithLayout<T = any> = NextPage<T> & {
  sidebarType?: (pageProps: T) => 'DEFAULT' | 'TWITTER' | null
  getLayout?: (page: ReactElement, pageProps: T) => ReactNode
  HeaderComponent?: (pageProps: T) => FC | undefined
}
