import nProgress from 'nprogress'
import Router from 'next/router'
Router.events.on('routeChangeStart', () => nProgress.start())
Router.events.on('routeChangeComplete', () => nProgress.done())
Router.events.on('routeChangeError', () => nProgress.done())
import { FC } from 'react' // we need this to make JSX compile

const NProgress: FC = () => {
  return <></>
}

export default NProgress
