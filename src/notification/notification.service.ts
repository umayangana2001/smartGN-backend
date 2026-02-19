import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {

  private readonly BASE_URL = 'http://localhost:8080/api/notifications';

  // 🔔 Create notification
  async sendNotification(data: any) {
    try {
      await axios.post(this.BASE_URL, data);
    } catch (error: any) {
      console.error('Notification error:', error?.response?.data || error.message);
    }
  }

  // 📊 Get unread count
  async getUnreadCount(userId: string) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${userId}/unread-count`
      );
      return response.data;
    } catch (error: any) {
      console.error('Unread count error:', error?.response?.data || error.message);
      return 0;
    }
  }

  // 📜 Get all notifications for user
  async getNotifications(userId: string) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${userId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Get notifications error:', error?.response?.data || error.message);
      return [];
    }
  }

  // ✅ Mark notification as read
  async markAsRead(id: number) {
    try {
      const response = await axios.patch(
        `${this.BASE_URL}/${id}/read`
      );
      return response.data;
    } catch (error: any) {
      console.error('Mark as read error:', error?.response?.data || error.message);
      return null;
    }
  }
}
