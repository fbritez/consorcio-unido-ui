import axios from 'axios';
import SERVICE_URL from '../utils/constants'

class NotificationService {

    notificationFor = async consortium => {
        const notificationsData = await axios.get(`${SERVICE_URL}/notification/notificationFor?consortiumID=${consortium.id}`);
        return notificationsData.data.notifications
    }

    save = async (consortium, message, filename) => {
        const notification = { consortium_id: consortium.id, message: message, filename: filename}
        try {
            const response = await axios.post(`${SERVICE_URL}/notification/update`, { notification: notification});
            return response
        } catch (error) {
            console.log(error)
            return Promise.reject()
        }
    }

    loadReactions = async (notificationId, userEmail) => {
        const params = new URLSearchParams({
            notificationId,
            userEmail
        });
        const response = await axios.get(`${SERVICE_URL}/notification/reactions?${params}`);
        return response.data;
    }

    toggleReaction = async (notificationId, userEmail, reactionType) => {
        const body = {
            notificationId,
            userEmail,
            reactionType
        };
        const response = await axios.post(`${SERVICE_URL}/notification/reaction`, body);
        return response.data;
    }

    getUsersWhoReacted = async (notificationId, reactionType) => {
        const params = new URLSearchParams({
            notificationId,
            ...(reactionType && { reactionType })
        });
        const response = await axios.get(`${SERVICE_URL}/notification/reactions/users?${params}`);
        return response.data.users;
    }
}

const notificationService = new NotificationService();

export default notificationService;