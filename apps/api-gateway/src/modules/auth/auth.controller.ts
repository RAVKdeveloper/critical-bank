import { Controller, Post, Body, UseInterceptors, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { NotTg, makeResponse } from '@libs/core'
import { identity } from 'ramda'
import { User } from '@libs/core/decorators'
import { AppUser } from '@libs/core/types/user'

import { AuthService } from './auth.service'

import { UserRegistrationDto } from './dto/registration.dto'
import { LoginUserDto } from './dto/login-user.dto'

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  public async signUp(@Body() dto: UserRegistrationDto) {
    const data = await this.authService.signUp(dto)
    return makeResponse(data, identity)
  }

  @Post('/sign-in')
  public async signIn(@Body() dto: LoginUserDto) {
    const data = await this.authService.login(dto)
    return makeResponse(data, identity)
  }

  @Get('/me')
  public async me(@User() user: AppUser<NotTg>) {
    const data = await this.authService.me(user.id)
    return makeResponse(data, identity)
  }
}
