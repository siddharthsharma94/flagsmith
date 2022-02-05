// Sets item in reducer as loading, clears error for that item
import filter from 'lodash/filter'
import { AppState } from '../types/state-type'
import { IAction } from './saga-helpers'

export const itemLoading = (state: AppState, prefix: string) => {
  state[`${prefix}Error`] = null
  state[`${prefix}Loading`] = true
}

export const itemSaving = (state: AppState, prefix: string) => {
  state[`${prefix}Error`] = null
  state[`${prefix}Saving`] = true
}

// todo: perhaps we need loading/errors to be based on particular ids i.e. dont show user 2 as saving if it's just user 1
// Sets item in reducer as loaded, clears error for that item
export const itemLoaded = (
  state: AppState,
  prefix: string,
  action: IAction,
  skipLoadingLoaded = false,
) => {
  if (action.index) {
    // Item is part of a collection, add it within the prefix
    // eslint-disable-next-line no-prototype-builtins
    if (!state[prefix] || state[prefix]?.hasOwnProperty?.('length')) {
      //converts pre-existing arrays or nulls to an empty object
      state[prefix] = {}
    }
    state[prefix][action.index] = action.data.data
    if (!skipLoadingLoaded) {
      state[`${prefix}Error`] = null
      state[`${prefix}Loading`] = false
    }
  } else {
    state[prefix] = action.data.data
    if (!skipLoadingLoaded) {
      state[`${prefix}Loading`] = false
      state[`${prefix}Error`] = null
    }
  }
}

export const itemSaved = (
  state: AppState,
  prefix: string,
  action: IAction,
  skipSavingSaved = false,
  skipReplaceData = false,
) => {
  if (action.index) {
    // Item is part of a collection, add it within the prefix
    if (!state[prefix]) {
      state[prefix] = {}
    }
    if (!skipReplaceData) {
      state[prefix][action.index] = action.data
    }
    if (!skipSavingSaved) {
      state[`${prefix}Error`] = null
      state[`${prefix}Saving`] = false
    }
  } else if (!skipSavingSaved) {
    if (!skipReplaceData) {
      state[prefix] = action.data
    }
    state[`${prefix}Saving`] = false
    state[`${prefix}Error`] = null
  }
}

// Adds an item to the reducer collection, if one exists with the same ID it will be updated
// eslint-disable-next-line no-unused-vars
export const appendItem = (
  state: AppState,
  prefix: string,
  action: IAction,
) => {
  state[prefix] = filter(state[prefix], (i) => i.id !== action.data.id).concat([
    action.data,
  ])
}

// Removes an item from a collection based on an ID
// eslint-disable-next-line no-unused-vars
export const deleteItem = (
  state: AppState,
  prefix: string,
  action: IAction,
) => {
  state[prefix] = filter(state[prefix], (i) => i.id !== action.data.id)
}

export const itemError = (state: AppState, prefix: string, action: IAction) => {
  state[`${prefix}Error`] = action.error
  state[`${prefix}Loading`] = false
  state[`${prefix}Saving`] = false
}
