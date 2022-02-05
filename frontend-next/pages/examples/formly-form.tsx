import { ChangeEventHandler, FC } from 'react' // we need this to make JSX compile
import * as yup from 'yup'
import { useFormik } from 'formik'
import { Utils } from 'common/utils'
import Input from 'components/base/forms/Input'
import Column from 'components/base/grid/Column'
import Select from 'components/base/forms/Select'
import Button from 'components/base/forms/Button'
import withGrecaptcher from 'components/extras/withGracecaptcher'
import { Project } from 'common/project'

type ComponentType = {}

const schema = yup.object().shape({
  name: yup.string().required('You really need to enter a name'),
  dog: yup.string().required('Select a dog'),
  alias: yup.object().shape({
    value: yup.string().required('Must have alias'),
  }),
})

const TheComponent: FC<ComponentType> = ({}) => {
  const { handleChange, handleBlur, errors, values, setFieldValue, touched } =
    useFormik({
      validateOnMount: true,
      initialValues: {
        name: '',
        dog: '',
        alias: {
          value: '',
        },
      },
      validationSchema: schema,
      onSubmit: () => {
        console.log(values)
      },
    })

  const onDogChanged: ChangeEventHandler = (e) => {
    const dog = Utils.safeParseEventValue(e)
    setFieldValue('dog', dog)
    setFieldValue('alias.value', `mega${dog}`)
  }

  const changeHandler: ChangeEventHandler = (e) => {
    handleChange(e)
  }

  const hasErrors = !!Object.keys(errors).length

  return (
    <form
      method='POST'
      onSubmit={hasErrors ? Utils.preventDefault : undefined}
      action={`https://post.formlyapp.com/${Project.formly}?redirect=/?submitted=1`}
      className='col-md-8 mt-4'
    >
      <Column>
        <label htmlFor='name' className='mr-2'>
          Name
        </label>
        <Input
          type='text'
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.name}
          name='name'
        />
        {errors.name && touched.name && <div id='feedback'>{errors.name}</div>}
      </Column>
      <Column>
        <Select
          name='dog'
          title='Dogs'
          onChange={onDogChanged}
          onBlur={handleBlur}
          value={values.dog}
        >
          <option value='' />
          <option value='poodle'>Poodle</option>
          <option value='pug'>Pug</option>
        </Select>
        {errors.dog && touched.dog && <div id='feedback'>{errors.dog}</div>}
      </Column>
      <Column>
        <label htmlFor='name' className='mr-2'>
          Alias
        </label>
        <Input
          type='text'
          onChange={changeHandler}
          onBlur={handleBlur}
          value={values.alias?.value}
          name='alias'
        />
        {errors.alias?.value && touched.alias?.value && (
          <div id='feedback'>{errors.alias.value}</div>
        )}
      </Column>

      {Project.grecaptcher && (
        <div className='mt-4 mb-3'>
          <div id='recaptcha' />
        </div>
      )}

      <Button disabled={hasErrors} type='submit'>
        Submit
      </Button>
    </form>
  )
}

export default withGrecaptcher(TheComponent)
