import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, dto: CreateNotificationDto) {
    const notification = new this.notificationModel(
      Object.assign({}, dto, { userId }),
    );

    return notification.save();
  }

  async findAll(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ date: -1 })
      .exec();
  }

  async findOne(userId: string, id: string) {
    const notification = await this.notificationModel
      .findOne({ _id: id, userId })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async update(userId: string, id: string, dto: UpdateNotificationDto) {
    const notification = await this.notificationModel
      .findOneAndUpdate({ _id: id, userId }, dto, {
        returnDocument: 'after',
      })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async remove(userId: string, id: string) {
    const notification = await this.notificationModel
      .findOneAndDelete({ _id: id, userId })
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
