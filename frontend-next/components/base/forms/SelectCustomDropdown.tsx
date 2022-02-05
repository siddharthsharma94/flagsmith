import { FC, SelectHTMLAttributes, useRef, useState } from 'react'
import cx from 'classnames'
import useOnClickOutside from '../useClickOutside'
import Strings from 'project/localisation'

export type SelectCustomDropdown = SelectHTMLAttributes<any> & {
  title?: string
  isValid?: boolean
  onClick: (index: number) => void
  label?: string
}

const SelectCustomDropdown: FC<SelectCustomDropdown> = ({
  title,
  onClick,
  label,
  isValid,
  children,
  ...props
}) => {
  const [shouldValidate, setShouldValidate] = useState<boolean>(false)
  const [isActive, setIsActive] = useState<boolean>(false)
  const hide = () => setIsActive(false)
  const ref = useRef()
  useOnClickOutside(ref, hide)
  return (
    <>
      {title && <label className='select__text'>{title}</label>}
      {/* @ts-ignore*/}
      <div ref={ref} className='dropdown'>
        <div onClick={() => setIsActive(true)} className='select'>
          <select
            {...props}
            onBlur={(e) => {
              setShouldValidate(true)
              props.onBlur && props.onBlur(e)
            }}
            className={cx(`pointer-none ${props.className || ''}`, {
              invalid: shouldValidate && !isValid,
            })}
          >
            <option value={''}>{label || Strings.pleaseSelect}</option>
          </select>
          <i className='select__icon fas fa-caret-down' />
        </div>
        <div
          className={cx('dropdown-menu dropdown-menu-right', {
            show: isActive,
          })}
          aria-labelledby='dropdownMenuButton'
        >
          {
            //@ts-ignore
            children?.length
              ? //@ts-ignore
                children.map((child, i) => (
                  <a
                    key={i}
                    onClick={() => {
                      hide()
                      onClick(i)
                    }}
                    className='dropdown-item'
                    href='#'
                  >
                    {child}
                  </a>
                ))
              : children
          }
        </div>
      </div>
    </>
  )
}

SelectCustomDropdown.displayName = 'SelectCustomDropdown'
export default SelectCustomDropdown
