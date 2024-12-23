import { CryptoService } from '@lib/crypto'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenService } from '../refresh/refresh-token.service'
import { ConfigService } from '@libs/config'
import { AccessTokenData, GenAccessTokenDto, ObjPayload } from '@lib/tokens/types/gen-tokens.dto'
import type { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'
import type { JwtToken } from '@libs/core'
import type { ReturnVerifyAccessToken } from '@lib/tokens/types/verify-token.dto'

@Injectable()
export class AccessTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly cfg: ConfigService<TokensJwtEnvsModel>,
  ) {}

  public async genAccessTokenFromRefreshToken<T>(dto: GenAccessTokenDto<T>) {
    const key = this.cfg.env.ACCESS_TOKEN_ENCRYPT_KEY
    const refreshTokenHash = await this.cryptoService.hash.lightHash(dto.refreshToken, 'base58')
    const dataToEncrypt: AccessTokenData<T> = {
      data: dto.data,
      refreshHash: refreshTokenHash,
      isLight: false,
    }
    const encryptData = await this.cryptoService.encrypting.encryptSync(dataToEncrypt, key)
    const accessToken = await this.jwtService.signAsync({ data: encryptData } satisfies ObjPayload)

    return accessToken
  }

  public async genAccessToken<T>(dto: Omit<GenAccessTokenDto<T>, 'refreshToken'>) {
    const key = this.cfg.env.ACCESS_TOKEN_ENCRYPT_KEY
    const dataToEncrypt: AccessTokenData<T> = {
      data: dto.data,
      isLight: true,
    }
    const encryptData = await this.cryptoService.encrypting.encryptSync(dataToEncrypt, key)
    const accessToken = await this.jwtService.signAsync({ data: encryptData } satisfies ObjPayload)

    return accessToken
  }

  public async verifyAccessToken<T>(accessToken: JwtToken): Promise<ReturnVerifyAccessToken<T>> {
    const key = this.cfg.env.ACCESS_TOKEN_ENCRYPT_KEY
    const payload: ObjPayload = await this.jwtService.verifyAsync(accessToken)
    const decryptData = await this.cryptoService.encrypting.decryptSync(payload.data, key)

    return JSON.parse(decryptData)
  }
}
