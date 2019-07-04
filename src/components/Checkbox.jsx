import React from 'react'
import './Checkbox.scss'

function Checkbox({ type, children, ...props }) {
  return (
    <label className="checkbox-label">
      <input
        className="checkbox-hide"
        type="checkbox"
        onClick={props.toggle}
        defaultChecked={props.dfcheck}
      />
      <span className={props.checkstyle}></span>
      <span className="label">{children}</span>
    </label>
  )
}

export default Checkbox
