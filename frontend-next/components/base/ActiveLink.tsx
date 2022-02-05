import Link from 'next/link'
import { useRouter } from 'next/router'
import { Children, cloneElement, FC } from 'react'

interface ActiveLinkType {
  href?: string
  match: any
  as: string
  activeClassName?: string
}

const ActiveLink: FC<ActiveLinkType> = ({
  match,
  href = '',
  as,
  activeClassName = '',
  children,
}) => {
  const router = useRouter()
  const child = Children.only(children)
  // @ts-ignore
  let className = child.props.className || ''

  if (
    (!match && router.asPath === href && activeClassName) ||
    (match && (router.asPath || router.pathname).match(match))
  ) {
    className = `${className} ${activeClassName}`.trim()
  }

  return (
    <Link as={as} href={href}>
      {/*@ts-ignore*/}
      {cloneElement(child, { className })}
    </Link>
  )
}

export default ActiveLink
