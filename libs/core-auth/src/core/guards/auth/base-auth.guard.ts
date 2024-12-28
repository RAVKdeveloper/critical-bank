import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Request, Response } from 'express'

import { CookieAuthKeys, RequestHeaders } from '@libs/constants'
import { JwtStrategy } from '../../strategies'
import { TokenType } from '../../types/jwt.types'
import { BaseAuthUser } from '../../types/common'
import { AccessTokenData, RefreshTokenData } from '@lib/tokens/types/gen-tokens.dto'
import { RecoveryTokensService } from '../../service/recovery-tokens.service'

@Injectable()
export class BaseAuthGuard implements CanActivate {
  constructor(
    private readonly strategy: JwtStrategy,
    private readonly recoveryTokensService: RecoveryTokensService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest()
    const response: Response = context.switchToHttp().getResponse()
    const accessToken = request.cookies[CookieAuthKeys.CRITICAL_ACCESS_TOKEN]

    if (!accessToken) {
      return await this.validateRefresh(request, response)
    }

    try {
      const payload = await this.strategy.validate<AccessTokenData<BaseAuthUser>>(accessToken, {
        tokenType: TokenType.ACCESS_TOKEN,
      })
      request[RequestHeaders.USER] = payload.data
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }

  private async validateRefresh(request: Request, response: Response) {
    try {
      const refreshToken = request.cookies[CookieAuthKeys.CRITICAL_REFRESH_TOKEN]

      if (!refreshToken) {
        throw new UnauthorizedException()
      }

      const payload = await this.strategy.validate<RefreshTokenData<BaseAuthUser>>(refreshToken, {
        tokenType: TokenType.REFRESH_TOKEN,
      })

      const refreshInUser = await this.recoveryTokensService.refreshExistBy(payload.data.userId)

      if (!refreshInUser) {
        throw new UnauthorizedException()
      }

      const newAccessToken = await this.strategy.createNewAccessToken(refreshToken, payload.data)

      response.cookie(CookieAuthKeys.CRITICAL_ACCESS_TOKEN, newAccessToken, {
        httpOnly: true,
      })

      request[RequestHeaders.USER] = payload.data

      return true
    } catch {
      throw new UnauthorizedException()
    }
  }
}
