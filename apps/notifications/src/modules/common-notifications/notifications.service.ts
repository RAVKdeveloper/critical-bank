import { Injectable } from '@nestjs/common'

import { MongoRepoService } from '@lib/mongo-repo'
import {
  SendUserNotificationMsg,
  NotificationMsgContext,
  GetAllNotificationsByUserIdMsg,
  SendEmailNotificationMsg,
} from '@lib/kafka-types'
import { CustomLogger } from '@lib/logger'
import { NotificationTypeEnum } from '@lib/mongo-repo/enums'
import { genPaginationData } from '@libs/core'

import { TgNotificationsService } from '../tg-notifications/tg-notifications.service'
import { EmailNotificationService } from '../email-notifications/email-notification.service'

@Injectable()
export class NotificationsService {
  constructor(
    private readonly rep: MongoRepoService,
    private readonly tgNotifications: TgNotificationsService,
    private readonly emailNotifications: EmailNotificationService,
    private readonly logger: CustomLogger,
  ) {}

  public async getAllNotificationsByUserId(dto: GetAllNotificationsByUserIdMsg) {
    const paginationData = genPaginationData({ limit: dto.limit ?? 30, page: dto.page ?? 1 })
    const notifications = await this.rep.notification.find({
      where: { userId: dto.userId },
      skip: paginationData.skip,
      limit: paginationData.take,
      sort: {
        createdAt: dto.sortBy ?? 'DESC',
      },
    })
    const totalCount = await this.rep.notification.countDocuments({ where: { userId: dto.userId } })

    return {
      notifications,
      totalCount,
      totalPages: Math.ceil(totalCount / paginationData.take),
    }
  }

  public async prepareMessageToSendBasic(msg: SendUserNotificationMsg) {
    if (msg.msgContext === NotificationMsgContext.REGISTERED) {
      await this.emailNotifications.sendSuccessfulRegistration({
        to: msg.email,
      })

      const notification = await this.rep.notification.create({
        email: msg.email,
        userId: msg.userId,
        notificationType: NotificationTypeEnum.EMAIL,
        body: '',
        isRead: true,
      })

      await notification.save()

      return
    }

    if (msg.msgContext === NotificationMsgContext.AUTH_CODE) {
      if (!msg.body) {
        this.logger.error(
          'If message notification context === AUTH_CODE, expect other field with auth code',
        )
        return
      }

      await this.emailNotifications.sendAuthCode({ to: msg.email }, msg.body)

      return
    }

    if (msg.msgContext === NotificationMsgContext.LOGIN) {
      const location = this.parseDeviceAndIpFromOther(msg.other.body)

      await this.emailNotifications.sendLogin({ to: msg.email }, location.device, location.ip)

      if (msg.tgId) {
        await this.tgNotifications.sendLogin(msg.tgId, location.device, location.ip)
      }

      await this.rep.notification.create({
        email: msg.email,
        userId: msg.userId,
        notificationType: NotificationTypeEnum.BASIC,
        body: `Login, date ${new Date().toDateString()}, ip ${location.ip}, device ${location.device}`,
        tgId: msg.tgId,
        title: 'Successful Login',
        isRead: true,
      })
    }
  }

  public async sendEmailNotification(msg: SendEmailNotificationMsg) {
    await this.emailNotifications.sendOtherMsg({
      to: msg.email,
      context: {
        text: msg.body,
        title: msg.title,
      },
    })

    const notification = await this.rep.notification.create({
      email: msg.email,
      userId: msg.userId,
      notificationType: NotificationTypeEnum.EMAIL,
      body: msg.body,
      isRead: true,
      title: msg.title,
    })

    await notification.save()
  }

  private parseDeviceAndIpFromOther(other?: string) {
    if (!other) {
      this.logger.error('Method call notification expected other, received undefined')
      return { device: 'Mac', ip: '0.0.0.0' }
    }

    const object = JSON.parse(other)

    return { device: object.device, ip: object.ip }
  }
}
