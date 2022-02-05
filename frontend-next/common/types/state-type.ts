// Optional but if used means within our providers we can

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PageRequest<T> = T & {
  size?: number
  page?: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type PageResponse<T> = {
  [extraProps: string]: any
  content: T[]
  pageable: string
  totalPages: number
  numberOfElements: number
  totalElements: number
  last: boolean
  sort: {
    unsorted: boolean
    sorted: boolean
    empty: boolean
  }
  first: boolean
  size: number
  number: number
  empty: boolean
}

export interface RequestTypes {
  startup: {
    locale: string
    token?: string
    user?: AppState['user']
  }
  login: {
    [extraProps: string]: any
  }
  logout: {}
  register: {
    [extraProps: string]: any
  }
  updateUser: {
    id: string
    [extraProps: string]: any
  }
  confirmEmail: {
    [extraProps: string]: any
  }
  getUser: {
    [extraProps: string]: any
  }
  // END OF REQUEST_TYPES
}

export type ImageFile = {
  cropRect: {
    y: number
    height: number
    width: number
    x: number
  }
  modificationDate: string
  width: number
  size: number
  mime: string
  data: string
  height: number
  path: string
}

export interface AppState {
  locale?: string
  userLoading?: boolean
  userError?: string
  user?: {
    firstName: string
    lastName: string
    [extraProps: string]: any
  }
  userSaving?: boolean

  [extraProps: string]: any // Means that extra props are fine
  // END OF STATE_TYPES
}
