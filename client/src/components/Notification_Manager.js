
import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {removeNotification} from '../actions/ServerErrorHandling';

const Notification_Manager = () => {
  const notifications = useSelector(state => state.notifications)
  return (
    <div>
      {notifications.map(notification => (
        <Notification key={notification.notification_id} notification={notification} />
      ))}
    </div>
  )
}

const Notification = ({notification}) => {
  const dispatch = useDispatch();
  if (notification.notification_type === 1){
    return (
      <div className='popup-message'>
        <h3>Oops, something went wrong... Oh well...</h3>
        <p>{notification.message}</p>
        <p>( Error id: {notification.error_id} )</p>
        <button type='button' className='popup-button' onClick={()=>{
          removeNotification(notification.notification_id)(dispatch)
        }}>
          Ok
        </button>
      </div>
    )
  } else if (notification.notification_type === 0){
    return (
      <div className='popup-message'>
        <h3> Success! </h3>
        <p>{notification.message}</p>
        <button type='button' className='popup-button' onClick={()=>{
          removeNotification(notification.notification_id)(dispatch)
        }}>
          Ok
        </button>
      </div>
    )
  }
}

export default Notification_Manager;
