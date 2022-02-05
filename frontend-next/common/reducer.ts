import produce, { enableES5 } from 'immer'
import { Actions } from './app-actions'
import { AppState } from './types/state-type'
import './utils'
import { getApi } from './api/api'
// eslint-disable-next-line no-unused-vars
import { itemError, itemLoaded, itemLoading } from './utils/reducer-helpers'
enableES5() // required for react native hermes

const defaultReducer = produce((state: AppState, action): AppState | void => {
  if (typeof window === 'undefined') {
    getApi().log('SERVER', action.type, action.data)
    if (action.type.includes('ERROR')) {
      getApi().log('SERVER', action)
    }
  } else {
    getApi().log('DISPATCHER', action.type)
  }
  switch (action.type) {
    case Actions.LOGIN_LOADED:
    case Actions.UPDATE_USER_LOADED:
    case Actions.CONFIRM_EMAIL_LOADED:
    case Actions.REGISTER_LOADED:
      itemLoaded(state, 'user', action)
      break
    case Actions.LOGIN_ERROR:
    case Actions.CONFIRM_EMAIL_ERROR:
    case Actions.REGISTER_ERROR:
    case Actions.UPDATE_USER_ERROR:
      itemError(state, 'user', action)
      break
    case Actions.REGISTER:
    case Actions.UPDATE_USER:
    case Actions.CONFIRM_EMAIL:
    case Actions.LOGIN:
      itemLoading(state, 'user')
      break
    case Actions.CLEAR_USER:
      if (state.user?.id) {
        getApi().push?.unsubscribe(`${state.user.id}`)
      }
      state.user = undefined
      break
    case Actions.STARTUP_LOADED:
      Object.keys(action.data).map((k) => {
        state[k] = action.data[k]
      })
      break
    case Actions.SET_ACTIVE_SCREEN:
      itemLoaded(state, 'activeScreen', action, true)
      break

    case Actions.SCREEN_ERROR:
      // Clear Items within the reducer to protect against corrupt api data
      return state

    case Actions.NEXTJS_HYDRATE: {
      return {
        ...state,
        ...action.payload,
      }
    }

    case Actions.GET_USER:
      return itemLoading(state, 'user')
    case Actions.GET_USER_LOADED:
      return itemLoaded(state, 'user', action)
    case Actions.GET_USER_ERROR:
      return itemError(state, 'user', action)
    // END OF REDUCER
    // KEEP THE ABOVE LINE IN, IT IS USED BY OUR CLI
    default:
      break
  }
}, {})

export default defaultReducer
