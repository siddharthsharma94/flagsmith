import { API } from 'project/api'
import 'project/polyfill'
import App, { AppInitialProps, AppProps } from 'next/app'
import '../styles/Global.scss'
import LanguageHandler from 'common/LanguageHandler'
import { setApi } from 'common/api/api'
import { NextPageWithLayout } from 'types/nextPageWithLayout'
import { nextReduxWrapper } from 'components/util/nextReduxWrapper'
import NProgress from 'components/util/NProgress'
import { nextPromiseAction } from 'project/nextPromiseAction'
import Strings from 'project/localisation'
import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
// this makes sure setApi initializes API to common before getApi is used
setApi(API)

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

//@ts-ignore
class WrappedApp extends App<AppInitialProps> {
    public static getInitialProps = nextReduxWrapper.getInitialAppProps(
        (store) =>
            async ({ ctx }) => {
                try {
                    const locale = await API.getStoredLocale(ctx.req)
                    const toResolve: Promise<void>[] = []
                    if (!store.getState().locale) {
                        Strings.setLanguage(locale)
                        await nextPromiseAction<'startup'>(store, 'startup', {
                            locale,
                        })
                    }
                    await Promise.all(toResolve)
                } catch (e) {
                    console.error(e)
                }
                return {
                    pageProps: {},
                }
            }
    )

    public render() {
        const { Component, pageProps }: AppPropsWithLayout = this.props
        const getLayout = Component.getLayout || ((page) => page)
        return (
            <LanguageHandler>
                <Head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    />
                    <meta httpEquiv="x-ua-compatible" content="ie=edge" />
                    <meta
                        name="description"
                        content="Manage your Feature Flags, Feature Toggles and Remote Config in your Mobile, React, React Native, Java, Javascript (Node) and Python projects."
                    />
                    <script src="/javascript/highlight.min.js"/>
                    <script
                        src="https://browser.sentry-cdn.com/4.3.0/bundle.min.js"
                        crossOrigin="anonymous"
                    />
                    <script src="/javascript/msal.min.js"/>
                    <script
                        src="/javascript/jquery.min.js"
                        integrity="sha384-THPy051/pYDQGanwU6poAc/hOdQxjnOEXzbT+OuUAFqNqFjL+4IGLBgCJC3ZOShY"
                        crossOrigin="anonymous"
                    />
                    <script
                        src="/javascript/tether.min.js"
                        integrity="sha384-Plbmg8JY28KFelvJVai01l8WyZzrYWG825m+cZ0eDDS1f7d/js6ikvy1+X+guPIB"
                        crossOrigin="anonymous"
                    />
                    <script src="/api/project-overrides"/>
                </Head>
                <NProgress />
                {getLayout(<Component {...pageProps} />, pageProps)}
                <div id="modal" />
                <div id="confirm" />
                <div id="alert" />
                <ToastContainer />
            </LanguageHandler>
        )
    }
}

export default nextReduxWrapper.withRedux(WrappedApp)

