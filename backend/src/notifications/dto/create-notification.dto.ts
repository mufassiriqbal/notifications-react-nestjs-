import { NotificationCategory } from '../schemas/notification.schema';

export class CreateNotificationDto {
  header: string;
  body: string;
  category?: NotificationCategory;
  isClosed?: boolean;
  date?: number;
}
