import { AuthMsgPattern, AUTH_SERVICE_NAME } from '@lib/kafka-types'

export const AuthServiceMsgBrokerSubsArr = Object.values(AuthMsgPattern)
export { AUTH_SERVICE_NAME, AuthMsgPattern }
