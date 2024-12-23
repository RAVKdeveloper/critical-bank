import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptoService } from '@lib/crypto'
import { ConfigService } from '@libs/config'
import type { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'
import type { GenRefreshTokenDto, ObjPayload } from '@lib/tokens/types/gen-tokens.dto'
import type { Base64, JwtToken } from '@libs/core'
import type { ReturnVerifyRefreshToken } from '@lib/tokens/types/verify-token.dto'

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly cfg: ConfigService<TokensJwtEnvsModel>,
  ) {}

  public async getRefreshToken<T>(dto: GenRefreshTokenDto<T>): Promise<Base64> {
    const key = this.cfg.env.REFRESH_TOKEN_ENCRYPT_KEY
    const encryptData = await this.cryptoService.encrypting.encryptSync(dto, key)
    const refreshToken = await this.jwtService.signAsync({ data: encryptData } satisfies ObjPayload)

    return refreshToken
  }

  public async verifyRefreshToken<T>(refreshToken: JwtToken): Promise<ReturnVerifyRefreshToken<T>> {
    const payload: ObjPayload = await this.jwtService.verifyAsync(refreshToken) // get token with encrypted data
    const key = this.cfg.env.REFRESH_TOKEN_ENCRYPT_KEY
    const decryptData: string = await this.cryptoService.encrypting.decryptSync(payload.data, key) // get utf-8 string

    return JSON.parse(decryptData)
  }
}
