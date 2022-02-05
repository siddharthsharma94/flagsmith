import { Modal, ModalBody, ModalHeader } from './Modal'
import { FC, ReactNode } from 'react'

interface ModalDefault {
  title: ReactNode
  isOpen: boolean
  onDismiss: () => void
  toggle: () => void
}

const ModalDefault: FC<ModalDefault> = ({
  onDismiss,
  toggle,
  isOpen,
  title,
  children,
}) => {
  const onDissmissClick = () => {
    if (onDismiss) {
      onDismiss()
    }
    toggle()
  }
  return (
    <Modal unmountOnClose isOpen={isOpen} toggle={onDissmissClick}>
      <ModalHeader toggle={onDissmissClick}>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
    </Modal>
  )
}

export default ModalDefault
