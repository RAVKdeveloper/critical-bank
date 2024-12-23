import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request } from 'express'

import { CookieAuthKeys, RequestHeaders } from '@libs/constants'
import { JwtStrategy } from '../../strategies'
import { TokenType } from '../../types/jwt.types'
import { BaseAuthUser } from '../../types/common'
import { AccessTokenData } from '@lib/tokens/types/gen-tokens.dto'

@Injectable()
export class PreAuthGuard implements CanActivate {
  constructor(private readonly strategy: JwtStrategy) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const preAuthToken = request.cookies[CookieAuthKeys.PRE_AUTH_TOKEN]

    if (!preAuthToken) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.strategy.validate<AccessTokenData<BaseAuthUser>>(preAuthToken, {
        tokenType: TokenType.ACCESS_TOKEN,
      })
      request[RequestHeaders.PRE_AUTH_USER] = payload.data
    } catch (e) {
      console.log(e)
      throw new UnauthorizedException()
    }

    return true
  }
}
