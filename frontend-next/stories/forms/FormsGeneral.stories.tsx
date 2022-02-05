import { ComponentStory } from '@storybook/react'
import '../../styles/Global.scss'
import Input from 'components/base/forms/Input'
import Select from 'components/base/forms/Select'
import InputGroup from 'components/base/forms/InputGroup'
export default {
  title: 'forms/Forms',
  component: Input,
}

export const Default: ComponentStory<typeof Input> = (args) => (
  <>
    <>
      <div className='main p-5'>
        <div className='col mb-3'>
          <h5>Input</h5>
          <InputGroup placeholder='Placeholder text' id='input' title='Input' />
        </div>

        <div className='col'>
          <h5>Select</h5>
          <InputGroup
            id='select'
            title='Select'
            component={<Select id='select' {...args} label={'Select'} />}
          />
        </div>
      </div>
    </>
  </>
)

Default.args = {}
