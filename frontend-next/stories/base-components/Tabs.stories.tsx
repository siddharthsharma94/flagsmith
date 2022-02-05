import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import Tabs from 'components/base/forms/Tabs'

export default {
  title: 'Base/Tabs',
  component: Tabs,
}

export const Default: ComponentStory<typeof Tabs> = () => {
  return (
    <Tabs tabLabels={['Tab 1', 'Tab 2']} uncontrolled>
      <div>Tab 1</div>
      <div>Tab 2</div>
    </Tabs>
  )
}
