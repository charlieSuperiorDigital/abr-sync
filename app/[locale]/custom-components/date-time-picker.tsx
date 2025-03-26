import React from 'react'
import { DatePicker } from 'rsuite'


type Props = {
    disabled: boolean,
    dropDate?: string,
    row: any
}

const DateTimePicker = ({disabled, dropDate, row}: Props) => {
  return (
    <DatePicker
    format="dd/MM/yyyy hh:mm aa"
    showMeridiem
    appearance="subtle"
    disabled={disabled}
    placeholder="Select Date"
    onOk={date => console.log(date)}
    cleanable={false}
    loading={false}
    renderValue={date =>
      row.original.isInRental
        ? "in rental"
        : date?.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
    }
   
  />
  )
}

export default DateTimePicker