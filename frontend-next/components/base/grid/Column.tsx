import cn from 'classnames'
import { FC } from 'react'

interface Column {
  className?: string
}

//Div with standard horizontal padding
const Column: FC<Column> = ({ className, children, ...props }) => (
  <div {...props} className={cn(className, 'flex-column')}>
    {children}
  </div>
)

Column.displayName = 'Column'
export default Column
