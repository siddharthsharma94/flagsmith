import 'common/project'
import { ReactNode } from 'react'
/* eslint no-var: "off" */
declare global {
  var __JEST__: any
  var __DEV__: ?boolean
  var grecaptcha: any
  var ga: any
  var heap: any
  var mixpanel: any
  var projectOverrides: any
  var closeModal: () => void
  var openModal: (title: string, body: ReactNode) => void
  var openAlert: (
    title: string,
    children: ReactNode,
    onDismiss: () => void,
  ) => void
  var openConfirm: (
    title: string,
    body: ReactNode,
    onYes?: () => void,
    onNo?: () => void,
  ) => void
}
