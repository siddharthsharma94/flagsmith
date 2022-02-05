import Router from 'next/router'
import { Constants } from 'common/utils/constants'
import { errorHandler } from 'common/utils/errorHandler'
import { Project } from 'common/project'
import { IncomingMessage } from 'http'
import acceptLanguageParser from 'accept-language-parser'
import Strings from './localisation'
import { setApi } from 'common/api/api'
import flagsmith from 'flagsmith'

const API = {
  isMobile: () => false,
  flagsmith,
  getCookie(key:string) {
    return require('js-cookie').get(key);
  },
  setCookie(key:string, v:string) {
    try {
      require('js-cookie').set(key, v, { path: '/' });
      require('js-cookie').set(key, v, { path: '/', domain: Project.cookieDomain });
    } catch (e) {

    }
  },
  logoutRedirect() {
    const redirect = encodeURIComponent(Router.route)
    const as = encodeURIComponent(Router.asPath)
    let path = `/?redirect=${redirect}`
    if (redirect !== as) {
      path += `&as=${as}`
    }
    Router.replace(path)
  },
  ajaxHandler(type: string, e?: { message: string }) {
    return {
      type,
      error: errorHandler({
        defaultErrorMessage: Strings.defaultErrorMessage,
        gatewayTimeoutError: Strings.gatewayTimeoutError,
      })(e),
    }
  },
  middlewares: [],
  getStoredLocale: async (req?: IncomingMessage) => {
    if (req?.headers?.['accept-language']) {
      const acceptLanguages = acceptLanguageParser.parse(
        req.headers['accept-language'],
      )

      if (Array.isArray(acceptLanguages)) {
        return acceptLanguages[0]?.code || Constants.defaultLocale
      }
    }
    return Constants.defaultLocale
  },
  trackEvent(data:any) {
    if (__DEV__) {
      // eslint-disable-next-line
      console.info('track', data);
    }
    if (Project.ga) {
      if (!data) {
        // eslint-disable-next-line
        console.error('GA: Passed null event data');
        return
      }
      if ((!data || !data.category || !data.event) && __DEV__) {
        // eslint-disable-next-line
        console.error('Invalid event provided', data);
      }
      // @ts-ignore
      ga('send', {
        hitType: 'event',
        eventCategory: data.category,
        eventAction: data.event,
        eventLabel: data.label,
      })
    }
    // @ts-ignore
    if (Project.mixpanel && typeof mixpanel !== 'undefined') {
      if (!data) {
        // eslint-disable-next-line
        console.error("MIXPANEL: Passed null event data")
      }
      if (!data || !data.category || !data.event) {
        // eslint-disable-next-line
        console.error("MIXPANEL: Invalid event provided", data);
      }
      // @ts-ignore
      mixpanel.track(data.event, {
        category: data.category,
      })
    }
  },
  trackPage(title:string) {
    if (Project.ga) {
      ga('send', {
        hitType: 'pageview',
        title,
        location: document.location.href,
        page: document.location.pathname,
      });
    }
    if (Project.heap) {
      heap.track(`Page View  - ${title}`, {
        title,
        location: document.location.href,
        page: document.location.pathname,
      });
    }
    if (Project.mixpanel) {
      mixpanel.track(`Page View  - ${title}`, {
        title,
        location: document.location.href,
        page: document.location.pathname,
      });
    }
  },
  identify(id:any) {
    // @ts-ignore
    if (Project.mixpanel && typeof mixpanel !== 'undefined') {
      // @ts-ignore
      mixpanel.identify(id)
    }
  },
  // @ts-ignore
  log(namespace: keyof typeof Project['logs'], ...args: any[]) {
    if (Project.logs[namespace]) {
      // eslint-disable-next-line no-console
      console.log.apply(this, [namespace, ...args])
    }
  },
}
setApi(API)
export { API }
