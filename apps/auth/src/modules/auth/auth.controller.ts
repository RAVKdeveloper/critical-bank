import { Controller } from '@nestjs/common'

import {
  AuthServiceController,
  AuthServiceControllerMethods,
  Empty,
  GetMeMsg,
  LoginMsg,
  RegistrationMsg,
  RepeatVerificationCodeMsg,
  ResUserMsg,
  VerifyAuthCodeMsg,
} from '@libs/grpc-types'

import { AuthService } from './auth.service'
import { Observable } from 'rxjs'

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  public async registration(msg: RegistrationMsg): Promise<ResUserMsg> {
    return await this.authService.registration(msg)
  }

  public login(msg: LoginMsg): ResUserMsg | Promise<ResUserMsg> | Observable<ResUserMsg> {
    throw new Error('Method not implemented.')
  }

  public repeatAuthCode(
    msg: RepeatVerificationCodeMsg,
  ): Empty | Promise<Empty> | Observable<Empty> {
    throw new Error('Method not implemented.')
  }

  public verifyAuthCode(
    msg: VerifyAuthCodeMsg,
  ): ResUserMsg | Promise<ResUserMsg> | Observable<ResUserMsg> {
    throw new Error('Method not implemented.')
  }

  public me(msg: GetMeMsg): ResUserMsg | Promise<ResUserMsg> | Observable<ResUserMsg> {
    return this.authService.me(msg.userId)
  }
}
