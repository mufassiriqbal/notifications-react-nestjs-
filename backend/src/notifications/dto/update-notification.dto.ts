import { NotificationCategory } from '../schemas/notification.schema';

export class UpdateNotificationDto {
  header?: string;
  body?: string;
  category?: NotificationCategory;
  isClosed?: boolean;
  date?: number;
}
