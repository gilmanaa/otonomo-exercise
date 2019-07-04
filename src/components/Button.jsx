import cn from 'classnames'
import React from 'react'
import './Button.scss'

export default function Button({ className, ...props }) {
  return (
    <button
      className={cn(className, 'button')}
      onClick={props.add}
    >
      + Add
    </button>
  )
}
