import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { UUID } from '@libs/core'
import { ResponseLoginMsg } from '@lib/kafka-types'
import { Response } from 'express'
import {
  ACCESS_COOKIE_TOKEN_LIFE,
  CookieAuthKeys,
  REFRESH_COOKIE_TOKEN_LIFE,
} from '@libs/constants'

import { UserRegistrationDto } from './dto/registration.dto'
import {
  AuthServiceMsgBrokerSubsArr,
  AuthMsgPattern,
  AUTH_SERVICE_NAME,
  GetMeMsg,
  ResVerifyUserWithTokensMSg,
  VerifyAuthCodeMsg,
  RepeatVerifyCodeMsg,
} from './broker-subs'
import { LoginUserDto } from './dto/login-user.dto'
import { VerifyAuthCodeDto } from './dto/verify-auth-code.dto'

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
  constructor(@Inject(AUTH_SERVICE_NAME) private client: ClientKafka) {}

  public async onModuleInit() {
    const requestPatterns = AuthServiceMsgBrokerSubsArr
    requestPatterns.forEach(pattern => {
      this.client.subscribeToResponseOf(pattern)
    })
    await this.client.connect()
  }

  public async onApplicationShutdown() {
    await this.client.close()
  }

  public async signUp(dto: UserRegistrationDto) {
    const result = await lastValueFrom(this.client.send(AuthMsgPattern.USER_REGISTRATION, dto))

    return result
  }

  public async login(
    dto: LoginUserDto,
    res: Response,
  ): Promise<Omit<ResponseLoginMsg, 'preAuthToken'>> {
    const result: ResponseLoginMsg = await lastValueFrom(
      this.client.send(AuthMsgPattern.USER_LOGIN, dto),
    )

    res.cookie(CookieAuthKeys.PRE_AUTH_TOKEN, result.preAuthToken, {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date(Date.now() + ACCESS_COOKIE_TOKEN_LIFE),
    })

    return { userName: result.userName }
  }

  public async me(userId: UUID) {
    const user = await lastValueFrom(
      this.client.send(AuthMsgPattern.USER_GET_ME, { userId } satisfies GetMeMsg),
    )

    return user
  }

  public async verifyCode(userId: UUID, dto: VerifyAuthCodeDto, res: Response) {
    const result = await lastValueFrom(
      this.client.send<ResVerifyUserWithTokensMSg, VerifyAuthCodeMsg>(
        AuthMsgPattern.USER_VERIFY_AUTH_CODE,
        { userId, authCode: dto.authCode },
      ),
    )

    res.cookie(CookieAuthKeys.CRITICAL_ACCESS_TOKEN, result.accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + ACCESS_COOKIE_TOKEN_LIFE),
    })

    res.cookie(CookieAuthKeys.CRITICAL_REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + REFRESH_COOKIE_TOKEN_LIFE),
    })

    return result.userId
  }

  public async repeatAuthCode(userId: UUID) {
    this.client.emit<any, RepeatVerifyCodeMsg>(AuthMsgPattern.REPEAT_VERIFY_CODE, { userId })

    return userId
  }
}
