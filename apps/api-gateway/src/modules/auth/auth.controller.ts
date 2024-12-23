import { Controller, Post, Body, UseInterceptors, Get, Res, Patch } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { NotTg, makeResponse, CommonAuth, User, PreAuth, PreAuthUser } from '@libs/core'
import { identity } from 'ramda'
import { AppUser } from '@libs/core/types/user'
import { Response } from 'express'

import { AuthService } from './auth.service'

import { UserRegistrationDto } from './dto/registration.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { VerifyAuthCodeDto } from './dto/verify-auth-code.dto'
import { getUserMe } from './dto/get-me.dto'

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
  public async signIn(@Body() dto: LoginUserDto, @Res({ passthrough: true }) response: Response) {
    const data = await this.authService.login(dto, response)
    return makeResponse(data, identity)
  }

  @Get('/me')
  @CommonAuth()
  public async me(@User() user: AppUser<NotTg>) {
    const data = await this.authService.me(user.id)
    return makeResponse(data, getUserMe)
  }

  @Post('/verify/auth/code')
  @PreAuth()
  public async verifyCode(
    @PreAuthUser() user: AppUser<NotTg>,
    @Res({ passthrough: true }) response: Response,
    @Body() dto: VerifyAuthCodeDto,
  ) {
    const data = await this.authService.verifyCode(user.id, dto, response)
    return makeResponse(data, identity)
  }

  @Patch('/verify/auth/code-repeat')
  @PreAuth()
  public async repeatAuthCode(@PreAuthUser() user: AppUser<NotTg>) {
    const data = await this.authService.repeatAuthCode(user.id)
    return makeResponse(data, identity)
  }
}
