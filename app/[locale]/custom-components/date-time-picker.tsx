import React from 'react'
import { DatePicker } from 'rsuite'

type Props = {
  value?: string | null
  editable?: boolean
  onOk?: (date: Date) => void
  className?: string
}

const DateTimePicker: React.FC<Props> = ({
  value,
  editable = true,
  onOk,
  className
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Convert string date to Date object if value exists and is not empty
  const defaultDate = value ? new Date(value) : undefined
  
  // Only disable if we have a value and editable is false
  const isDisabled = value ? !editable : false

  return (
    <div onClick={handleClick}>
      <DatePicker
        format="dd/MM/yyyy hh:mm aa"
        showMeridiem
        appearance="subtle"
        placeholder="Select Date"
        onOk={onOk}
        cleanable={false}
        disabled={isDisabled}
        defaultValue={defaultDate}
        loading={false}
        className={className}
        renderValue={date =>
          value
            ? new Date(value).toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })
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
    </div>
  )
}

export default DateTimePicker