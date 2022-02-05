import { all, put, takeLatest } from 'redux-saga/effects'
import { Actions } from './app-actions'
import { getApi } from './api/api'
import {
  errorHandler,
  getAction,
  IAction,
  postAction,
  updateAction,
} from './utils/saga-helpers'
import _data from './utils/_data'
import { RequestTypes } from './types/state-type'

// Called when the application starts up, if using SSR this is done in the server
export function* startup(action: IAction<RequestTypes['startup']>) {
  try {
    const { ...rest } = action.data || {}
    const token = action.data?.token

    if (token) {
      _data.setToken(token)
      // set the user
    }

    const isOnline = typeof navigator === 'undefined' ? true : navigator.onLine
    const data = { ready: true, isOnline, ...rest }
    yield put({
      type: Actions.STARTUP_LOADED,
      data: { ready: true, isOnline, ...rest },
    })
    if (action.onSuccess) {
      action.onSuccess(data)
    }
  } catch (e) {
    yield put(getApi().ajaxHandler(Actions.STARTUP_ERROR, e))
    if (action?.onError) {
      action.onError({ error: e })
    }
  }
}

export function* login(action: IAction<RequestTypes['login']>) {
  yield errorHandler(action, 'LOGIN', false, 'LOGIN IS NOT IMPLEMENTED IN SAGA')
}

export function* register(action: IAction<RequestTypes['register']>) {
  try {
    yield errorHandler(
      action,
      'LOGIN',
      false,
      'REGISTER IS NOT IMPLEMENTED IN SAGA',
    )
  } catch (e) {}
}
export function* logout(action: IAction<RequestTypes['logout']>) {
  yield put({ type: Actions.CLEAR_USER })
  getApi().logout?.()
  action.onSuccess && action.onSuccess()
}

export function* confirmEmail(action: IAction<RequestTypes['confirmEmail']>) {
  yield postAction(
    action,
    `${getApi().getAPIBaseUrl()}user/verify/email`,
    'CONFIRM_EMAIL',
  )
}

export function* updateUser(action: IAction<RequestTypes['updateUser']>) {
  yield updateAction(
    action,
    `${getApi().getAPIBaseUrl()}user/${action.data.id}`,
    'UPDATE_USER',
  )
}

export function* getUser(action: IAction<RequestTypes['getUser']>) {
  yield getAction(action, `${getApi().getAPIBaseUrl()}user`, 'GET_USER')
}

// END OF YIELDS

function* rootSaga() {
  yield all([
    takeLatest(Actions.LOGIN, login),
    takeLatest(Actions.REGISTER, register),
    takeLatest(Actions.LOGOUT, logout),
    takeLatest(Actions.CONFIRM_EMAIL, confirmEmail),
    takeLatest(Actions.UPDATE_USER, updateUser),
    takeLatest(Actions.STARTUP, startup),
    takeLatest(Actions.GET_USER, getUser),
    // END OF TAKE_LATEST
    // KEEP THE ABOVE LINE IN, IT IS USED BY OUR CLI
  ])
}

export default rootSaga
