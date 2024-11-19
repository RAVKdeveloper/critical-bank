import { AuthMsgPattern, AUTH_SERVICE_NAME, GetMeMsg } from '@lib/kafka-types'

export const AuthServiceMsgBrokerSubsArr = [
  ...Object.values(AuthMsgPattern),
  'auth.user-registration.reply',
]
export { AUTH_SERVICE_NAME, AuthMsgPattern, GetMeMsg }
