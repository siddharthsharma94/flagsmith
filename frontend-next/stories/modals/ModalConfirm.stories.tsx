import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import Confirm from 'components/ModalConfirm'

export default {
  title: 'modals/Modal Confirm',
  component: Confirm,
}

export const Default: ComponentStory<typeof Confirm> = (args) => {
  return (
    <>
      {/*// @ts-ignore*/}
      <>
        <div id='modal' />
        <div id='confirm' />
        <div id='alert' />
        <div id='toast' />
      </>
      <Confirm {...args}>Test</Confirm>
    </>
  )
}
Default.args = {
  isOpen: true,
  title: 'Confirm this thing',
  children: 'Test',
}
