import cn from 'classnames'
import { FC } from 'react'

interface FormGroup {
  className?: string
}

const FormGroup: FC<FormGroup> = ({ className, ...props }) => (
  //Div with standard vertical padding
  <div {...props} className={cn(className, 'form-group')} />
)

export default FormGroup
