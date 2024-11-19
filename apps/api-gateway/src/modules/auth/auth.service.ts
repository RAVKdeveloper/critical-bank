import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { UUID } from '@libs/core'

import { UserRegistrationDto } from './dto/registration.dto'
import {
  AuthServiceMsgBrokerSubsArr,
  AuthMsgPattern,
  AUTH_SERVICE_NAME,
  GetMeMsg,
} from './broker-subs'
import { LoginUserDto } from './dto/login-user.dto'

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

  public async login(dto: LoginUserDto) {
    const result = await lastValueFrom(this.client.send(AuthMsgPattern.USER_LOGIN, dto))

    return result
  }

  public async me(userId: UUID) {
    const user = await lastValueFrom(
      this.client.send(AuthMsgPattern.USER_GET_ME, { userId } satisfies GetMeMsg),
    )

    return user
  }
}
