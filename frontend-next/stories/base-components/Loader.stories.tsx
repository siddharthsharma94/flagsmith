import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import Loader from 'components/Loader'

export default {
  title: 'Base/Loader',
  component: Loader,
}

export const Default: ComponentStory<typeof Loader> = () => <Loader />
