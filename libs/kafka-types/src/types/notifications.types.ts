import { NotificationEntity } from '@lib/mongo-repo/schemas'
import { ReturnPaginationDto } from '@libs/core'

export const NOTIFICATION_CONSUMER = 'notification-consumer'
export const NOTIFICATIONS_SERVICE_NAME = 'NOTIFICATION_SERVICE'
export const NOTIFICATIONS_CLIENT_ID = 'utils-services'

export enum NotificationMsgPattern {
  BASIC_SEND_NOTIFICATION = 'notification.basic-send',
  EMAIL_SEND_NOTIFICATION = 'notification.email-send',
  GET_ALL_NOTIFICATIONS = 'notification.get-all-notifications',
}

export enum NotificationMsgContext {
  REGISTERED = 'REGISTERED',
  AUTH_CODE = 'AUTH_CODE',
  LOGIN = 'LOGIN',
  NEWS = 'NEWS',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export interface SendUserNotificationMsg {
  readonly userId: string
  readonly tgId?: number
  readonly email?: string
  readonly title?: string
  readonly body?: string
  readonly msgContext: NotificationMsgContext
  readonly other?: {
    readonly title?: string
    readonly body?: string
  }
}

export interface SendEmailNotificationMsg {
  readonly userId: string
  readonly email: string
  readonly title: string
  readonly body: string
}

export interface GetAllNotificationsByUserIdMsg {
  readonly userId: string
  readonly limit?: number
  readonly page?: number
  readonly sortBy?: 'ASC' | 'DESC'
}

export interface ReturnAllNotificationsByUserId extends ReturnPaginationDto {
  readonly notifications: NotificationEntity[]
}

export interface KafkaNotificationController {
  sendBasicNotification: (msg: SendUserNotificationMsg) => Promise<void>
  sendEmailNotification: (msg: SendEmailNotificationMsg) => Promise<void>
  getAllNotificationsByUserId: (
    msg: GetAllNotificationsByUserIdMsg,
  ) => Promise<ReturnAllNotificationsByUserId>
}
