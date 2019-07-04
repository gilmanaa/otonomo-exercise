import React from 'react'
import cn from 'classnames'

import './Input.scss'

function Input({ className, ...props }) {
  return (
    <input
      type="text"
      className={cn('input', className)}
      ref={props.vin}
      placeholder= "VIN"
    />
  )
}

export default Input
