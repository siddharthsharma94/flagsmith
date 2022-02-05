import { FC } from 'react'
import cn from 'classnames'

interface Props {
  className?: string
}

export const TheComponent: FC<Props> = ({ className, children }) => (
  <div className={cn(className, 'some-custom-class')}>{children}</div>
)

export default TheComponent
