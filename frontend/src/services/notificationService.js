import api from './api';

export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: () => api.patch('/notifications/read'),
};
