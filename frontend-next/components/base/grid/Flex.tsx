import cn from 'classnames'
import { FC } from 'react'

export type FlexType = {
  className?: string
  value?: number
  onClick?: () => void
}

//Div with flex
const Flex: FC<FlexType> = ({ className, value = 1, ...props }) => (
  <div {...props} className={cn({ flex: true }, `flex-${value}`, className)} />
)

Flex.displayName = 'Flex'
export default Flex
