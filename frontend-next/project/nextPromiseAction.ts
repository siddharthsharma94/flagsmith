import { AppState } from 'common/types/state-type'
import { Store } from 'redux'
import { AppActions } from 'common/app-actions'

export function nextPromiseAction<K extends keyof typeof AppActions>(
  store: Store<AppState>,
  appAction: K,
  actionData: Parameters<typeof AppActions[K]>[0],
) {
  return new Promise((res, rej) => {
    store.dispatch(
      // @ts-ignore todo: if Anyone knows how to improve the type of appAction so this passes
      AppActions[appAction](actionData, { onSuccess: res, onError: rej }),
    )
  })
}
