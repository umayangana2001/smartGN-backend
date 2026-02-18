import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationService {

  async sendNotification(data: any) {
    try {
      await axios.post(
        'http://localhost:8080/api/notifications',
        data
      );
    } catch (error) {
      console.error('Notification error:', error.message);
    }
  }
}
