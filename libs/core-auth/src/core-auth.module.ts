import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@libs/config'
import { TokensModule } from '@lib/tokens'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'

import { CoreAuthService } from './core-auth.service'
import { JwtStrategy } from './core/strategies/internal/jwt.strategy'
import { CoreAuthEnvsModel } from './core/model/core-auth.envs.model'
import { RecoveryTokensService } from './core/service/recovery-tokens.service'

@Module({
  imports: [
    ConfigModule,
    TokensModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: { env: CoreAuthEnvsModel }) => {
        const store = await redisStore({
          socket: {
            host: config.env.AUTH_REDIS_HOST,
            port: config.env.AUTH_REDIS_PORT,
          },
          ttl: config.env.REFRESH_TOKENS_CACHE_TTL,
        })

        return { store }
      },
      inject: [ConfigService],
    }),
  ],
  providers: [CoreAuthService, JwtStrategy, RecoveryTokensService],
  exports: [CoreAuthService, JwtStrategy, CacheModule, RecoveryTokensService],
})
export class CoreAuthModule {}
