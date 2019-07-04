import React from 'react'
import cn from 'classnames'

import './Input.scss'

function Input({ className, ...props }) {
  return (
    <input
      type="text"
      {...props}
      className={cn('input', className)}
      ref={props.vin}
    />
  )
}

export default Input
