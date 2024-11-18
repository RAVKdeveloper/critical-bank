import { Controller } from '@nestjs/common'

import { UUID } from '@libs/core'
import { Transactional } from '@nestjs-cls/transactional'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { Observable } from 'rxjs'
import {
  AuthMsgPattern,
  RepeatVerifyCodeMsg,
  KafkaAuthController,
  GetMeMsg,
  LoginMsg,
  RegistrationMsg,
  ResUserMsg,
  ResVerifyUserWithTokensMSg,
  VerifyAuthCodeMsg,
} from '@lib/kafka-types'

import { AuthService } from './auth.service'

@Controller()
export class AuthController implements KafkaAuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthMsgPattern.USER_REGISTRATION)
  @Transactional()
  public async registration(@Payload() msg: RegistrationMsg): Promise<ResUserMsg> {
    return await this.authService.registration(msg)
  }

  @MessagePattern(AuthMsgPattern.USER_LOGIN)
  public async login(@Payload() msg: LoginMsg): Promise<ResUserMsg> {
    return await this.authService.login(msg)
  }

  @MessagePattern(AuthMsgPattern.REPEAT_VERIFY_CODE)
  public async repeatAuthCode(@Payload() msg: RepeatVerifyCodeMsg): Promise<void> {
    return await this.authService.repeatAuthCode(msg)
  }

  @MessagePattern(AuthMsgPattern.USER_VERIFY_AUTH_CODE)
  @Transactional()
  public async verifyAuthCode(
    @Payload() msg: VerifyAuthCodeMsg,
  ): Promise<ResVerifyUserWithTokensMSg> {
    return await this.authService.verifyUserLoginAuthCode(msg)
  }

  @MessagePattern(AuthMsgPattern.USER_GET_ME)
  public async me(@Payload() msg: GetMeMsg): Promise<ResUserMsg> {
    return await this.authService.me(msg.userId as UUID)
  }
}
