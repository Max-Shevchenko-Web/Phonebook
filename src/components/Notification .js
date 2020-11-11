import React from 'react'

function Notification ({message, className}) {
  if (message === null) {
    return null
  }
  const classNotif = `notification ${className}`

  return (
    <div className={classNotif}>
      {message}
    </div>
  )
}

export default Notification
