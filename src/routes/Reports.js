import React from 'react'
import { DatePicker } from 'antd'

const {RangePicker} = DatePicker

const Reports = () => {
  const handleRangeChange = (date, dateString) => {
    console.log(date, dateString)
  }
  return (
    <RangePicker onChange={handleRangeChange} />
  )
}

export default Reports