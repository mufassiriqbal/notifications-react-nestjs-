import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationCategory {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, trim: true })
  header: string;

  @Prop({ required: true, trim: true })
  body: string;

  @Prop({
    required: true,
    enum: NotificationCategory,
    default: NotificationCategory.INFO,
  })
  category: NotificationCategory;

  @Prop({ default: false })
  isClosed: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: Number, required: true, default: Date.now })
  date: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
