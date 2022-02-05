import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import Panel from 'components/extras/Panel'
import { ButtonPrimary } from 'components/base/forms/Button'

export default {
  title: 'Base/Panel',
  component: Panel,
}

export const Default: ComponentStory<typeof Panel> = (args) => (
  <Panel icon='fas fa-exclamation-circle' title='Panel with icon' {...args}>
    Content
  </Panel>
)
export const WithAction: ComponentStory<typeof Panel> = (args) => (
  <Panel
    action={<ButtonPrimary>Action</ButtonPrimary>}
    title='Panel with action'
    {...args}
  >
    Content
  </Panel>
)

//   <Panel
// action={<ButtonPrimary>Action</ButtonPrimary>}
// title='Panel with action'
//   >
//   Content
//   </Panel>
// ))
// .add('with icon', () => (
//   <Panel icon='ion-md-heart' title='Panel with icon'>
//     Content
//   </Panel>
// ))
