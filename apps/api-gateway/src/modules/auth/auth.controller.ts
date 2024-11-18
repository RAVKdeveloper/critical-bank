import { Controller, Post, Body, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { makeResponse } from '@libs/core'
import { identity } from 'ramda'

import { AuthService } from './auth.service'

import { UserRegistrationDto } from './dto/registration.dto'

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  public async signUp(@Body() dto: UserRegistrationDto) {
    const data = await this.authService.signUp(dto)
    return makeResponse(data, identity)
  }
}
