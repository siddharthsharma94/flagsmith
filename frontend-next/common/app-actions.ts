import { AnyAction } from 'redux'
import { RequestTypes } from './types/state-type'
import { HYDRATE } from 'next-redux-wrapper'

const BaseConstants = {
  LOGIN: 'LOGIN',
  LOGIN_LOADED: 'LOGIN_LOADED',
  LOGIN_ERROR: 'LOGIN_ERROR',
  REFRESH_TOKENS: 'REFRESH_TOKENS',

  'GET_USER': 'GET_USER',
  'GET_USER_LOADED': 'GET_USER_LOADED',
  'GET_USER_ERROR': 'GET_USER_ERROR',

  REGISTER: 'REGISTER',
  REGISTER_LOADED: 'REGISTER_LOADED',
  REGISTER_ERROR: 'REGISTER_ERROR',

  STARTUP: 'STARTUP',
  STARTUP_LOADED: 'STARTUP_LOADED',
  STARTUP_ERROR: 'STARTUP_ERROR',

  LOGOUT: 'LOGOUT',
  CLEAR_USER: 'CLEAR_USER',
  REFRESH: 'REFRESH',

  CONFIRM_EMAIL: 'CONFIRM_EMAIL',
  CONFIRM_EMAIL_ERROR: 'CONFIRM_EMAIL_ERROR',
  CONFIRM_EMAIL_LOADED: 'CONFIRM_EMAIL_LOADED',

  UPDATE_USER: 'UPDATE_USER',
  UPDATE_USER_ERROR: 'UPDATE_USER_ERROR',
  UPDATE_USER_LOADED: 'UPDATE_USER_LOADED',

  SET_ACTIVE_SCREEN: 'SET_ACTIVE_SCREEN',
  SCREEN_ERROR: 'SCREEN_ERROR',

  NEXTJS_HYDRATE: HYDRATE,
}
export interface Callbacks {
  onSuccess?: (data?: any) => void
  onError?: (data: any, originalError?: any) => void
}

const BaseActions = {
  login(data: RequestTypes['login'], callbacks: Callbacks = {}): AnyAction {
    return {
      type: Actions.LOGIN,
      data,
      ...callbacks,
    }
  },
  startup(data: RequestTypes['startup'], callbacks: Callbacks = {}): AnyAction {
    return {
      type: Actions.STARTUP,
      data,
      ...callbacks,
    }
  },
  register(
    data: RequestTypes['register'],
    callbacks: Callbacks = {},
  ): AnyAction {
    return {
      type: Actions.REGISTER,
      data,
      ...callbacks,
    }
  },
  updateUser(
    data: RequestTypes['updateUser'],
    callbacks: Callbacks = {},
  ): AnyAction {
    return {
      type: Actions.UPDATE_USER,
      data,
      ...callbacks,
    }
  },
  confirmEmail(
    data: RequestTypes['confirmEmail'],
    callbacks: Callbacks = {},
  ): AnyAction {
    return {
      type: Actions.CONFIRM_EMAIL,
      data,
      ...callbacks,
    }
  },
  getUser(data: RequestTypes['getUser'], callbacks: Callbacks = {}): AnyAction {
    return {
      type: Actions.GET_USER,
      data,
      ...callbacks,
    }
  },
  logout(data: RequestTypes['logout'], callbacks: Callbacks = {}): AnyAction {
    return {
      type: Actions.LOGOUT,
      ...callbacks,
    }
  },
  setActiveScreen(name: string, navigator = 'root'): AnyAction {
    return {
      type: Actions.SET_ACTIVE_SCREEN,
      index: navigator,
      data: name,
    }
  },
}

// @ts-ignore
export const Actions = (global.Actions = Object.assign({}, BaseConstants, {
  // END OF ACTION_STRINGS
}))

// @ts-ignore
export const AppActions = (global.AppActions = Object.assign({}, BaseActions, {
  // END OF APP_ACTIONS
}))
