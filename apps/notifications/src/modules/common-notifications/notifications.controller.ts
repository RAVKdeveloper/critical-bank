import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import {
  GetAllNotificationsByUserIdMsg,
  KafkaNotificationController,
  ReturnAllNotificationsByUserId,
  SendAuthCodeMsg,
  SendEmailNotificationMsg,
  SendUserNotificationMsg,
  NotificationMsgPattern,
} from '@lib/kafka-types'

import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController implements KafkaNotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern(NotificationMsgPattern.BASIC_SEND_NOTIFICATION)
  public async sendBasicNotification(@Payload() msg: SendUserNotificationMsg) {
    return await this.notificationsService.prepareMessageToSendBasic(msg)
  }

  @MessagePattern(NotificationMsgPattern.EMAIL_SEND_NOTIFICATION)
  public async sendEmailNotification(@Payload() msg: SendEmailNotificationMsg) {
    return await this.notificationsService.sendEmailNotification(msg)
  }

  @MessagePattern(NotificationMsgPattern.GET_ALL_NOTIFICATIONS)
  public async getAllNotificationsByUserId(msg: GetAllNotificationsByUserIdMsg) {
    return await this.notificationsService.getAllNotificationsByUserId(msg)
  }
}
