import { Project } from '../project'
import { Constants } from './constants'
import { getApi } from '../api/api'
import { getStrings } from '../strings'

const getQueryString = (params: any): string => {
  const esc = encodeURIComponent
  return Object.keys(params)
    .map((k) => `${esc(k)}=${esc(params[k])}`)
    .join('&')
}

export enum RequestMethod {
  get = 'get',
  put = 'put',
  delete = 'delete',
  patch = 'patch',
  post = 'post',
}

interface RequestOptions {
  timeout: number
  method: RequestMethod
  headers: any
  body?: string
}
const generateE2EURL = (url: string) => {
  return `http://localhost:5000?url=${encodeURIComponent(url)}&namespace=${
    Constants.E2E_NAMESPACE || 'default'
  }&baseUrl=${encodeURIComponent(Project.api)}`
}
const _data = {
  token: '',
  refreshToken: '',
  type: '',
  E2E: Constants.E2E,
  async status(response: any): Promise<any> {
    // handle ajax requests
    // console.debug(response);
    if (response.status === 403) {
      getApi().logout?.()
      return Promise.reject({ message: 'UNAUTHORIZED' })
    }
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    }
    return response
      .clone()
      .text() // cloned so response body can be used downstream
      .then((err: string) => {
        if (
          // @ts-ignore
          typeof E2E !== 'undefined' &&
          // @ts-ignore
          E2E &&
          // @ts-ignore
          document?.getElementById('e2e-error')
        ) {
          const error = {
            url: response.url,
            status: response.status,
            error: err,
          }
          document.getElementById('e2e-error')!.innerText =
            JSON.stringify(error)
        }
        getApi().log(response.url, response.status, err)

        // eslint-disable-next-line
        return Promise.reject({ ...response, _bodyText: err, httpStatus: response.status});
      })
  },

  get(url: string, data?: any, headers?: any): Promise<any> {
    return _data._request(RequestMethod.get, url, data || null, headers)
  },

  patch(url: string, data: any, headers?: any): Promise<any> {
    return _data._request(RequestMethod.patch, url, data, headers)
  },

  put(url: string, data: any, headers?: any): Promise<any> {
    return _data._request(RequestMethod.put, url, data, headers)
  },

  post(url: string, data: any, headers?: any): Promise<any> {
    return _data._request(RequestMethod.post, url, data, headers)
  },

  delete(url: string, data?: any, headers?: any): Promise<any> {
    return _data._request(RequestMethod.delete, url, data, headers)
  },

  async _request(
    method: RequestMethod,
    url: string,
    data: any,
    headers: any = {},
    proxied?: boolean,
  ): Promise<any> {
    const prom = Promise.resolve()

    const skipAuthHeader = Object.keys(headers).length > 0
    return prom.then(async () => {
      const options: RequestOptions = {
        timeout: 60000,
        method,
        headers: {
          'Accept-Language': getStrings().getLanguage(),
          ...headers,
        },
      }
      if (Constants.E2E) {
        options.headers['E2E-Test'] = '1'
      }
      let qs = ''

      if (method !== RequestMethod.get && !options.headers['content-type'])
        options.headers['content-type'] = 'application/json'

      // const session = await getApi().auth.Cognito.getSession()
      // if (session && session.accessToken) {
      //   _data.token = session.accessToken.jwtToken;
      // }
      if (_data.token && !skipAuthHeader) {
        // add auth tokens to headers of all requests
        options.headers.AUTHORIZATION = `Bearer ${_data.token}`
      } else if (Project.apiAuth) {
        options.headers.AUTHORIZATION = Project.apiAuth
      }
      if (data) {
        if (method === RequestMethod.get) {
          qs = getQueryString(data)
          url += url.indexOf('?') !== -1 ? `&${qs}` : `?${qs}`
        } else if (options.headers['content-type'] === 'application/json') {
          options.body = JSON.stringify(data)
        } else {
          options.body = data
        }
      } else if (
        method === RequestMethod.post ||
        method === RequestMethod.put
      ) {
        options.body = '{}'
      }

      if (
        Constants.E2E &&
        typeof document !== 'undefined' &&
        document?.getElementById('e2e-request')
      ) {
        const payload = {
          url,
          options,
        }
        document.getElementById('e2e-request')!.innerText =
          JSON.stringify(payload)
      }

      getApi().log('API', 'REQUEST', method, url, data, headers)

      const req = fetch(
        Constants.E2E && !proxied ? generateE2EURL(url) : url,
        options,
      )
      return req
        .then((res) => _data.status(res))
        .then((response) => {
          // always return json
          let contentType = response.headers.get('content-type')
          if (!contentType) {
            contentType = response.headers.get('Content-Type')
          }
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return response.json()
          }
          return {}
        })
        .then((response) => {
          getApi().log(
            'API',
            'RESPONSE',
            method,
            url,
            'Response body',
            response,
            'Original request',
            options,
          )
          return response
        })
    })
  },

  setToken: (_token?: string): void => {
    // set the token for future requests
    _data.token = _token || ''
  },

  setRefreshToken(_refreshToken?: string): void {
    // set the token for future requests
    _data.refreshToken = _refreshToken || ''
  },
}
export default _data
