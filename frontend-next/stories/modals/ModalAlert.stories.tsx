import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import ModalAlert from 'components/ModalAlert'

export default {
  title: 'modals/Modal Alert',
  component: ModalAlert,
}

export const Default: ComponentStory<typeof ModalAlert> = (args) => {
  return (
    <>
      <ModalAlert isOpen title='Alert' {...args}>
        Test
      </ModalAlert>
    </>
  )
}
