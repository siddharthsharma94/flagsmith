import { NextPageContext } from 'next/dist/shared/lib/utils'
import { FC } from 'react'
import { Store } from 'redux'
import { AppState } from 'common/types/state-type'

export type NextSSRComponentType<T> = FC<T> & {
  getComponentProps: (
    store: Store<AppState>,
    ctx: NextPageContext,
  ) => Promise<void>
}
