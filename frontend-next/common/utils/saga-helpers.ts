// Error handler for a CRUD redux action
import { put } from 'redux-saga/effects'
import { Actions, Callbacks } from '../app-actions'
import _data from './_data'
import { Utils } from './utils'
import { AnyAction } from 'redux'
import { PutEffect } from '@redux-saga/core/effects'
import { getApi } from '../api/api'

export type IAction<ActionData = any> = Callbacks &
  AnyAction & {
    data: ActionData
  }

type DtoType<InData, OutData> = (data: InData) => Promise<OutData> | OutData

export function* errorHandler(
  action: IAction,
  prefix: string,
  preventSuccess?: boolean,
  e?: unknown,
) {
  let originalError: Error | { message: string } | undefined
  // @ts-ignore
  const error = getApi().ajaxHandler(Actions[`${prefix}_ERROR`], e)
  yield put(error)
  // @ts-ignore
  if (e?._bodyText) {
    try {
      // @ts-ignore
      originalError = JSON.parse(e._bodyText!)
    } catch (e) {}
  }

  action.onError &&
    setTimeout(() => {
      action.onError!(error.error, originalError || '')
    }, 0)
  if (preventSuccess) {
    throw e
  }
}
// Success handler for a CRUD redux action
export function* handleResponse<ActionData, ServerData, AppData = ServerData>(
  action: IAction<ActionData>,
  prefix: string,
  apiResult: ServerData,
  preventSuccess?: boolean,
  dto?: DtoType<ServerData, AppData>,
  ignoreId?: boolean,
): Generator<PutEffect, AppData> {
  // @ts-ignore generator for some reason can't match the type here
  const data: AppData = yield dto ? dto(apiResult) : apiResult

  const params = {
    // @ts-ignore can't detect `${prefix}_LOADED` as valid
    type: Actions[`${prefix}_LOADED`],
    data,
    originalAction: action,
    index: undefined,
  }

  //@ts-expect-error server data may include a token
  if (data?.token) {
    //@ts-expect-error server data may include a token
    _data.setToken(data.token)
  }
  // @ts-expect-error the action data may or may not have an id
  if (action.data && action.data.id && !ignoreId) {
    // @ts-expect-error
    params.index = action.data.id
  }
  yield put(params)
  action.onSuccess &&
    !preventSuccess &&
    setTimeout(() => {
      action.onSuccess!(data)
    }, 0)
  return data as AppData
}

// GET request with standard response and error handler
export function* getAction<ActionData, ServerData, AppData = ServerData>(
  action: IAction<ActionData>,
  url: string,
  prefix: string,
  preventSuccess?: boolean,
  dto?: DtoType<ServerData, AppData>,
  ignoreId?: boolean,
) {
  try {
    const postfix =
      action.data && Object.keys(action.data).length
        ? `?${Utils.toParam(action.data)}`
        : ''
    const data: ServerData = yield _data.get(`${url}${postfix}`)
    const res: AppData = yield handleResponse<ActionData, ServerData, AppData>(
      action,
      prefix,
      data,
      preventSuccess,
      dto,
      ignoreId,
    )
    return res
  } catch (e: unknown) {
    yield errorHandler(action, prefix, preventSuccess, e)
  }
}

// PUT request with standard response and error handler
export function* updateAction<
  ActionData,
  ServerData,
  RequestData = ActionData,
  AppData = ServerData,
>(
  action: IAction<ActionData>,
  url: string,
  prefix: string,
  preventSuccess?: boolean,
  dto?: DtoType<ServerData, AppData>,
  requestDto?: DtoType<ActionData, RequestData>,
  append = true,
) {
  try {
    const request: RequestData = yield requestDto
      ? requestDto(action.data)
      : action.data
    const data: ServerData = yield _data.put(url, request)
    const res: AppData = yield handleResponse<ActionData, ServerData, AppData>(
      action,
      prefix,
      data,
      preventSuccess,
      dto,
      append,
    )
    return res
  } catch (e) {
    yield errorHandler(action, prefix, preventSuccess, e)
  }
}

// PATCH request with standard response and error handler
export function* patchAction<
  ActionData,
  ServerData,
  RequestData = ActionData,
  AppData = ServerData,
>(
  action: IAction<ActionData>,
  url: string,
  prefix: string,
  preventSuccess?: boolean,
  dto?: DtoType<ServerData, AppData>,
  requestDto?: DtoType<ActionData, RequestData>,
  append = true,
) {
  try {
    const request: RequestData = yield requestDto
      ? requestDto(action.data)
      : action.data
    const data: ServerData = yield _data.patch(url, request)
    const res: AppData = yield handleResponse(
      action,
      prefix,
      data,
      preventSuccess,
      dto,
      append,
    )
    return res
  } catch (e) {
    yield errorHandler(action, prefix, preventSuccess, e)
  }
}

// POST request with standard response and error handler
export function* postAction<
  ActionData,
  ServerData,
  RequestData = ActionData,
  AppData = ServerData,
>(
  action: IAction<ActionData>,
  url: string,
  prefix: string,
  preventSuccess?: boolean,
  dto?: DtoType<ServerData, AppData>,
  requestDto?: DtoType<ActionData, RequestData>,
  append = true,
) {
  try {
    const data: ServerData = yield _data.post(
      url,
      requestDto ? requestDto(action.data) : action.data,
    )
    const res: AppData = yield handleResponse(
      action,
      prefix,
      data,
      preventSuccess,
      dto,
      append,
    )
    return res
  } catch (e) {
    if (preventSuccess) {
      throw e
    } else {
      yield errorHandler(action, prefix, preventSuccess, e)
    }
  }
}

export function* deleteAction<ActionData, ServerData, AppData = ServerData>(
  action: IAction<ActionData>,
  url: string,
  prefix: string,
  preventSuccess?: boolean,
) {
  try {
    const data: ServerData = yield _data.delete(url, {})
    const res: AppData = yield handleResponse<ActionData, ServerData>(
      action,
      prefix,
      data,
      preventSuccess,
    )
    return res
  } catch (e) {
    yield errorHandler(action, prefix, preventSuccess, e)
  }
}
