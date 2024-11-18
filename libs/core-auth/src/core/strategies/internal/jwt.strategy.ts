import { Injectable } from '@nestjs/common'
import { JwtToken } from '@libs/core'
import { TokensService } from '@lib/tokens'

import type { Strategy } from '../../types/strategy.interface'
import { TokenType, type JwtStrategyParams } from '../../types/jwt.types'
import { BaseAuthPayloadToToken } from '../../types/common'

@Injectable()
export class JwtStrategy implements Strategy<JwtStrategyParams> {
  constructor(private readonly tokensService: TokensService) {}

  public async validate<Payload>(token: JwtToken, params: JwtStrategyParams): Promise<Payload> {
    if (params.tokenType === TokenType.ACCESS_TOKEN) {
      return (await this.validateAccess(token)) as Payload
    } else if (params.tokenType === TokenType.REFRESH_TOKEN) {
      return (await this.validateRefresh(token)) as Payload
    }

    throw new Error('Invalid token type!')
  }

  public async createNewAccessToken(refreshToken: JwtToken, payload: BaseAuthPayloadToToken) {
    return await this.tokensService.utils.accessToken.genAccessTokenFromRefreshToken({
      data: payload,
      refreshToken,
    })
  }

  private async validateAccess(accessToken: JwtToken) {
    return await this.tokensService.utils.accessToken.verifyAccessToken(accessToken)
  }

  private async validateRefresh(refreshToken: JwtToken) {
    return await this.tokensService.utils.refreshToken.verifyRefreshToken(refreshToken)
  }
}
