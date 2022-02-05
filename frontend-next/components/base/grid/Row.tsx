import cn from 'classnames'
import { FC } from 'react'

interface Row {
  className?: string
  space?: boolean
  value?: number
}

const Row: FC<Row> = ({ className, children, space, ...props }) => (
  <div {...props} className={cn({ 'flex-row': true, space }, className)}>
    {children}
  </div>
)

Row.displayName = 'Row'
export default Row
