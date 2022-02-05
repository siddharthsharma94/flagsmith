import { applyMiddleware, createStore, Store } from 'redux'
import { persistStore } from 'redux-persist'
import { PersistConfig } from 'redux-persist/es/types'
import createSagaMiddleware, { Task } from 'redux-saga'
import './app-actions'
import rootReducer from './reducer'
import rootSaga from './saga'
import { AppState } from './types/state-type'
import { getApi } from './api/api'

let store: Store & {
  __PERSISTOR?: ReturnType<typeof persistStore>
  sagaTask?: Task
}

export default function _store(
  initialState: AppState = {},
  forceNewStore = false,
  web = false,
) {
  // It's very important to only return the cached store on the client, otherwise SSR will return the previous request state
  // @ts-ignore
  if (
    store &&
    (typeof window !== 'undefined' || global.__JEST__ !== 'undefined') &&
    !forceNewStore
  ) {
    return store
  }

  const sagaMiddleware = createSagaMiddleware()

  const middlewares = getApi().middlewares
    ? [sagaMiddleware, ...getApi().middlewares]
    : [sagaMiddleware]

  if (web) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { composeWithDevTools } = require('redux-devtools-extension')
    store = createStore(
      rootReducer,
      initialState,
      composeWithDevTools(...[applyMiddleware(...middlewares)]),
    )
  } else {
    const storage =
      getApi().reduxStorage ||
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('redux-persist/lib/storage').default
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { persistReducer } = require('redux-persist')

    const persistConfig: PersistConfig<any, any, any> = {
      key: 'root',
      whitelist: ['user'],
      storage,
    }

    store = createStore(
      persistReducer(persistConfig, rootReducer),
      initialState,
      applyMiddleware(...middlewares),
    )

    store.__PERSISTOR = persistStore(store)
  }

  store.sagaTask = sagaMiddleware.run(rootSaga)

  return store
}
