import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import {
  AuthMsgPattern,
  KafkaAuthRecoveryController,
  ResponseUpdatePasswordMsg,
  ResponseUserForgotPasswordMsg,
  UpdateUserPasswordMsg,
  UserBlockAccount,
  UserForgotPasswordMsg,
} from '@lib/kafka-types'

import { AuthRecoveryService } from './auth-recovery.service'

@Controller()
export class AuthRecoveryController implements KafkaAuthRecoveryController {
  constructor(private readonly authRecoveryService: AuthRecoveryService) {}

  @MessagePattern(AuthMsgPattern.FORGOT_PASS)
  public async userForgotPassword(
    @Payload() msg: UserForgotPasswordMsg,
  ): Promise<ResponseUserForgotPasswordMsg> {
    return await this.authRecoveryService.forgotPassword(msg)
  }

  @MessagePattern(AuthMsgPattern.UPDATE_PASS)
  public async userUpdatePassword(
    @Payload() msg: UpdateUserPasswordMsg,
  ): Promise<ResponseUpdatePasswordMsg> {
    return await this.authRecoveryService.updatePassword(msg)
  }

  @MessagePattern(AuthMsgPattern.BLOCK_ACC)
  public async userBlockAccount(@Payload() msg: UserBlockAccount): Promise<void> {
    return await this.authRecoveryService.userBlockAccount(msg)
  }
}
