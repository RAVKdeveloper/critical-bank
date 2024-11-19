import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, EventPattern } from '@nestjs/microservices'

import {
  GetAllNotificationsByUserIdMsg,
  KafkaNotificationController,
  SendEmailNotificationMsg,
  SendUserNotificationMsg,
  NotificationMsgPattern,
} from '@lib/kafka-types'

import { NotificationsService } from './notifications.service'

@Controller()
export class NotificationsController implements KafkaNotificationController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern(NotificationMsgPattern.BASIC_SEND_NOTIFICATION)
  public async sendBasicNotification(@Payload() msg: SendUserNotificationMsg) {
    return await this.notificationsService.prepareMessageToSendBasic(msg)
  }

  @EventPattern(NotificationMsgPattern.EMAIL_SEND_NOTIFICATION)
  public async sendEmailNotification(@Payload() msg: SendEmailNotificationMsg) {
    return await this.notificationsService.sendEmailNotification(msg)
  }

  @MessagePattern(NotificationMsgPattern.GET_ALL_NOTIFICATIONS)
  public async getAllNotificationsByUserId(@Payload() msg: GetAllNotificationsByUserIdMsg) {
    return await this.notificationsService.getAllNotificationsByUserId(msg)
  }
}
