import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {

  constructor(private readonly notificationService: NotificationService) {}

  // Get unread count
  @Get(':userId/unread-count')
  async getUnreadCount(@Param('userId') userId: string) {
    return this.notificationService.getUnreadCount(userId);
  }

  // Get all notifications
  @Get(':userId')
  async getNotifications(@Param('userId') userId: string) {
    return this.notificationService.getNotifications(userId);
  }

  // Mark as read
  @Patch(':id/read')
  async markAsRead(@Param('id') id: number) {
    return this.notificationService.markAsRead(id);
  }
}
