import { createWrapper } from 'next-redux-wrapper'
import createStore from 'common/store'
import { Store } from 'redux'
import { AppState } from 'common/types/state-type'
import { Project } from 'common/project'

const makeStore = () => {
  return createStore(undefined, true, true)
}

export const nextReduxWrapper = createWrapper<Store<AppState>>(makeStore, {
  debug: Project.logs.DISPATCHER,
})
