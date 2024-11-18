import {
  NotificationMsgPattern,
  SendUserNotificationMsg,
  NOTIFICATIONS_SERVICE_NAME,
  NotificationMsgContext,
} from '@lib/kafka-types'

export const AuthServiceMsgBrokerSubsArr = [NotificationMsgPattern.BASIC_SEND_NOTIFICATION]
export type SendSuccessfulAuthNotificationMsg = SendUserNotificationMsg
export { NOTIFICATIONS_SERVICE_NAME, NotificationMsgPattern, NotificationMsgContext }
