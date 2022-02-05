import { APIType } from '../types/api-type'

type APISingleton<T extends APIType = APIType> = {
  instance: T | undefined
}

const api: APISingleton = {
  instance: undefined,
}

const getApi: () => APIType = () => {
  if (!api.instance) {
    throw new Error(
      'API is not initialized. Make sure Web or Mobile sets api.instance',
    )
  }
  return api.instance
}

const setApi = <T extends APIType>(apiParam: T) => {
  api.instance = apiParam
}

export { getApi, setApi }
