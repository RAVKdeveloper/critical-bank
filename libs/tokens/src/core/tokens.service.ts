import { ConfigService } from '@libs/config'
import { Injectable } from '@nestjs/common'
import { CryptoService } from '@lib/crypto'

import { AccessTokenService } from './access/access-token.service'
import { RefreshTokenService } from './refresh/refresh-token.service'

import type { TokensJwtEnvsModel } from '../model/jwt.envs.model'
import type { GenTokensPairDto, ReturnTokensPair } from '../types/gen-tokens.dto'

@Injectable()
export class TokensService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  public async genTokensPair<T>(dto: GenTokensPairDto<T>): Promise<ReturnTokensPair> {
    const refreshToken = await this.refreshTokenService.getRefreshToken(dto)
    const accessToken = await this.accessTokenService.genAccessTokenFromRefreshToken({
      data: dto.data,
      refreshToken,
    })

    return { accessToken, refreshToken }
  }

  public get utils() {
    return {
      accessToken: this.accessTokenService,
      refreshToken: this.refreshTokenService,
    }
  }
}
