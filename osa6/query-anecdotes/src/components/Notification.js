import { useNotificationValue, useNotificationDispatch } from "../NotificationContext"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const value = useNotificationValue()
  const dispatch = useNotificationDispatch()

  if (!value) return null
  else setTimeout(() => {dispatch({type: "NULL"})}, 5000)

  return (
    <div style={style}>
      {value}
    </div>
  )
}

export default Notification
