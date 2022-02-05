import _DatePicker, { ReactDatePickerProps } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FC } from 'react'
import { Constants } from '../common/utils'
import Input from 'components/base/forms/Input'

export type DatePickerProps = ReactDatePickerProps & {}

export const DatePicker: FC<DatePickerProps> = ({ onChange, ...rest }) => {
  if (Constants.E2E) {
    return (
      <Input
        onChange={(e) => {
          // @ts-ignore
          const date = new Date(Utils.safeParseEventValue(e))
          if (!isNaN(date.valueOf())) {
            // @ts-ignore
            onChange(date.toISOString())
          }
        }}
      />
    )
  }
  return <_DatePicker onChange={onChange} {...rest} />
}

DatePicker.displayName = 'DatePicker'
export default DatePicker
