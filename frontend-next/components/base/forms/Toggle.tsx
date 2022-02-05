import { FC, MouseEvent } from 'react'

interface Toggle {
  checked: boolean
  onChange: (event: MouseEvent<HTMLElement>) => void
}

const Toggle: FC<Toggle> = ({ checked, onChange, children }) => (
  <button
    className={`btn toggle-control d-flex justify-content-center align-items-center ${
      checked ? 'selected' : ''
    }`}
    onClick={onChange}
    type='button'
  >
    {children}
  </button>
)

Toggle.displayName = 'Toggle'
export default Toggle
