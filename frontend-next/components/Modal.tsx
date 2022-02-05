import _ModalHeader from 'reactstrap/lib/ModalHeader'
import _ModalBody from 'reactstrap/lib/ModalBody'
import _Modal, { ModalProps } from 'reactstrap/lib/Modal'
import _ModalFooter from 'reactstrap/lib/ModalFooter'
import { JSXElementConstructor, useCallback, useState } from 'react'
import { unmountComponentAtNode, render } from 'react-dom'
import Confirm from './ModalConfirm'
import ModalDefault from './ModalDefault'
import Alert from './ModalAlert'
import store from '../common/store'
import { Provider } from 'react-redux'

export const ModalHeader = _ModalHeader
export const ModalFooter = _ModalFooter
export const Modal = (args: ModalProps) => <_Modal {...args} />
export const ModalBody = _ModalBody

const withModal = (WrappedComponent: JSXElementConstructor<any>) => {
  const withFoo = (props: ModalProps) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState(true)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const toggle = useCallback(() => setIsOpen(false), [setIsOpen])
    global.closeModal = toggle

    return (
      <Provider store={store()}>
        <WrappedComponent toggle={toggle} {...props} isOpen={isOpen} />
      </Provider>
    )
  }

  return withFoo
}

const _Confirm = withModal(Confirm)
const _Alert = withModal(Alert)
const _ModalDefault = withModal(ModalDefault)

export const openAlert = (global.openAlert = (title, children, onDismiss) => {
  document.getElementById('alert') &&
    unmountComponentAtNode(document.getElementById('alert')!)
  render(
    <_Alert title={title} onDismiss={onDismiss}>
      {children}
    </_Alert>,
    document.getElementById('alert'),
  )
})

export const openConfirm = (global.openConfirm = (title, body, onYes, onNo) => {
  document.getElementById('confirm') &&
    unmountComponentAtNode(document.getElementById('confirm')!)
  render(
    <_Confirm isOpen onNo={onNo} onYes={onYes} title={title}>
      {body}
    </_Confirm>,
    document.getElementById('confirm'),
  )
})

export const openModal = (global.openModal = (title, body) => {
  document.getElementById('modal') &&
    unmountComponentAtNode(document.getElementById('modal')!)
  render(
    <_ModalDefault isOpen title={title}>
      {body}
    </_ModalDefault>,
    document.getElementById('modal'),
  )
})
