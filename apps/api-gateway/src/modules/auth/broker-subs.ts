import {
  AuthMsgPattern,
  AUTH_SERVICE_NAME,
  GetMeMsg,
  ResVerifyUserWithTokensMSg,
  VerifyAuthCodeMsg,
  RepeatVerifyCodeMsg,
} from '@lib/kafka-types'

export const AuthServiceMsgBrokerSubsArr = Object.values(AuthMsgPattern)
export {
  AUTH_SERVICE_NAME,
  AuthMsgPattern,
  GetMeMsg,
  ResVerifyUserWithTokensMSg,
  VerifyAuthCodeMsg,
  RepeatVerifyCodeMsg,
}
