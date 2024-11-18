import {
  NotificationMsgPattern,
  NOTIFICATIONS_SERVICE_NAME,
  NotificationMsgContext,
  SendEmailNotificationMsg,
} from '@lib/kafka-types'

export const AuthRecoveryServiceMsgBrokerSubsArr = [NotificationMsgPattern.EMAIL_SEND_NOTIFICATION]
export type SendUpdatePasswordMsg = SendEmailNotificationMsg
export { NOTIFICATIONS_SERVICE_NAME, NotificationMsgPattern, NotificationMsgContext }
