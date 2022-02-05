import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'components/Modal'
import Button from 'components/base/forms/Button'

export default {
  title: 'modals/Modal',
  component: Modal,
}

export const Default: ComponentStory<typeof Modal> = (args) => {
  return (
    <Modal {...args} isOpen>
      <ModalHeader>Modal title</ModalHeader>
      <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </ModalBody>
      <ModalFooter>
        <Button>Do Something</Button> <Button>Cancel</Button>
      </ModalFooter>
    </Modal>
  )
}
