import React, { useState, useContext, useEffect } from 'react';
import notificationService from '../../services/notification-service/notification-service';
import { ConsortiumContext } from '../consortium/consortium-provider/consortium-provider';
import { UserContext } from '../user-provider/user-provider';
import NotificatioDetailsView from './notification-details-view';

const NotificationListView = props => {

    const { consortium } = useContext(ConsortiumContext);
    const { user } = useContext(UserContext);
    const [ notifications, setNotifications ] = useState([])

    useEffect(() => {
        setNotifications([]);
        const fetchNotifications = async () => {
            const result = await notificationService.notificationFor(consortium);
            setNotifications(result);
        };
        fetchNotifications();
    }, [consortium, props.shouldRefresh]);

    return(
        <div>
        {   notifications?.map(notification => {
                        return (<NotificatioDetailsView key={notification.id} notification={notification} userEmail={user?.email}/>)
                    })
        }
        </div>
    )
}

export default NotificationListView