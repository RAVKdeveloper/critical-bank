import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { JwtToken, UUID } from '@libs/core'
import { ConfigService } from '@libs/config'

import { CoreAuthEnvsModel } from '../model/core-auth.envs.model'

@Injectable()
export class RecoveryTokensService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly refreshTokensCache: Cache,
    private readonly cfg: ConfigService<CoreAuthEnvsModel>,
  ) {}

  public async refreshExistBy(userId: UUID): Promise<boolean> {
    const isHasInCache = await this.refreshTokensCache.get(userId)

    if (!isHasInCache) {
      return false
    }

    return true
  }

  public async deleteTokenByUserId(userId: UUID) {
    const token = await this.refreshTokensCache.get(userId)

    if (!token) return

    await this.refreshTokensCache.del(userId)
  }

  public async setNewRefreshToken(userId: UUID, refreshToken: JwtToken) {
    const token = await this.refreshTokensCache.get(userId)

    if (token) {
      await this.refreshTokensCache.del(userId)
    }

    await this.refreshTokensCache.set(userId, refreshToken, {
      ttl: this.cfg.env.REFRESH_TOKENS_CACHE_TTL,
    })
  }
}
