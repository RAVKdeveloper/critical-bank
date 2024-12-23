import { JwtToken, UUID } from '@libs/core'
import { UserEntity } from '@libs/repository'

export const AUTH_CONSUMER = 'auth-consumer'
export const AUTH_SERVICE_NAME = 'AUTH_SERVICE'
export const AUTH_CLIENT_ID = 'auth-services'

export enum AuthMsgPattern {
  REPEAT_VERIFY_CODE = 'auth.repeat-verify-code',
  FORGOT_PASS = 'auth.forgot-password',
  UPDATE_PASS = 'auth.update-pass',
  BLOCK_ACC = 'auth.block-account',
  USER_REGISTRATION = 'auth.user-registration',
  USER_LOGIN = 'auth.user-login',
  USER_GET_ME = 'auth.get-me',
  USER_VERIFY_AUTH_CODE = 'auth.verify-auth-code',
}

export interface RepeatVerifyCodeMsg {
  readonly userId: UUID
}

export interface UserForgotPasswordMsg {
  readonly email?: string
  readonly tgId?: number
  readonly phoneNumber?: string
}

export interface RegistrationMsg {
  email: string | undefined
  phoneNumber?: string | undefined
  tgId?: number | undefined
  userName: string
  userSurname: string
  userLastName?: string | undefined
  password: string
}

export interface LoginMsg {
  email?: string | undefined
  phoneNumber?: string | undefined
  password: string
}

export interface ResponseUserForgotPasswordMsg {
  readonly preAuthToken: JwtToken
}

export interface UpdateUserPasswordMsg {
  readonly userId: UUID
  readonly newPassword: string
  readonly preAuthToken: JwtToken
  readonly verifyCode: string
}

export interface ResponseUpdatePasswordMsg {
  readonly success: boolean
}

export interface UserBlockAccount {
  readonly userId: UUID
}

export interface ResUserMsg {
  user: Omit<UserEntity, 'passwordHash'> | undefined
  timestamp: number
}

export interface ResponseLoginMsg {
  readonly preAuthToken: string
  readonly userName: string
}

export interface ResVerifyUserWithTokensMSg {
  userId: string
  accessToken: string
  refreshToken: string
}

export interface GetMeMsg {
  userId: UUID
}

export interface VerifyAuthCodeMsg {
  userId: UUID
  authCode: string
}

export interface KafkaAuthRecoveryController {
  userForgotPassword: (msg: UserForgotPasswordMsg) => Promise<ResponseUserForgotPasswordMsg>
  userUpdatePassword: (msg: UpdateUserPasswordMsg) => Promise<ResponseUpdatePasswordMsg>
  userBlockAccount: (msg: UserBlockAccount) => Promise<void>
}

export interface KafkaAuthController {
  repeatAuthCode: (msg: RepeatVerifyCodeMsg) => Promise<void>
  registration(request: RegistrationMsg): Promise<ResUserMsg>
  login(request: LoginMsg): Promise<ResponseLoginMsg>
  verifyAuthCode(request: VerifyAuthCodeMsg): Promise<ResVerifyUserWithTokensMSg>
  me(request: GetMeMsg): Promise<ResUserMsg>
}
