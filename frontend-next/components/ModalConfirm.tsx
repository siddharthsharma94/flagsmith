// I don't know why we have this import because we didn't use it.
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal'
import {
  ButtonDanger,
  ButtonPrimary,
  ButtonSecondary,
} from './base/forms/Button'
import { FC, ReactNode } from 'react'

interface Confirm {
  title: ReactNode
  isOpen: boolean
  isDanger?: boolean
  onYes?: () => void
  onNo?: () => void
  noText?: string
  disabled?: boolean
  disabledYes?: boolean
  yesText?: string
  toggle?: () => void
}

const Confirm: FC<Confirm> = ({
  onNo,
  isDanger,
  disabled,
  disabledYes,
  toggle,
  onYes,
  isOpen,
  title,
  children,
  yesText = 'OK',
  noText = 'Cancel',
}) => {
  const no = () => (onNo ? onNo() : toggle?.())
  const yes = () => (onYes ? onYes() : toggle?.())

  return (
    <Modal unmountOnClose isOpen={isOpen} toggle={no}>
      <ModalHeader toggle={no}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <ButtonSecondary
          data-test='confirm-no'
          disabled={disabled}
          onClick={no}
        >
          {noText}
        </ButtonSecondary>
        {isDanger ? (
          <ButtonDanger
            data-test='confirm-yes'
            disabled={disabled || disabledYes}
            icon='fas fa-trash'
            onClick={yes}
          >
            {yesText}
          </ButtonDanger>
        ) : (
          <ButtonPrimary
            data-test='confirm-yes'
            disabled={disabled || disabledYes}
            onClick={yes}
          >
            {yesText}
          </ButtonPrimary>
        )}{' '}
      </ModalFooter>
    </Modal>
  )
}

export default Confirm
