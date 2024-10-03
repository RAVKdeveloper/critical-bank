import { CacheModule } from '@nestjs/cache-manager'
import { Global, Module } from '@nestjs/common'
import { redisStore } from 'cache-manager-redis-yet'

import { ConfigModule, ConfigService } from '@libs/config'

import type { CacheDbConfig } from './config.model'

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: { env: CacheDbConfig }) => {
        const store = await redisStore({
          socket: {
            host: config.env.REDIS_HOST,
            port: +config.env.REDIS_PORT,
          },
          ttl: 10000,
        })

        return { store, ttl: 10000 }
      },
      inject: [ConfigService],
    }),
  ],
})
export class CacheDatabaseModule {}
