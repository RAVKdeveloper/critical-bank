import { Module } from '@nestjs/common'

import { RepositoryModule } from '@libs/repository'
import { CacheDatabaseModule } from '@libs/cache'
import { CustomLoggerModule } from '@lib/logger'
import { CryptoModule } from '@lib/crypto'
import { KafkaClientModule } from '@lib/micro-clients'
import { ConfigService } from '@libs/config'
import {
  NOTIFICATIONS_CLIENT_ID,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATION_CONSUMER,
} from '@lib/kafka-types'

import { ConfigModule } from '../../config/config.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ConfigModel } from '../../config/config.model'
import { AuthCodeModule } from '../auth-code/auth-code.module'

@Module({
  imports: [
    RepositoryModule,
    ConfigModule,
    CacheDatabaseModule,
    CustomLoggerModule,
    CryptoModule,
    KafkaClientModule.registerAsync({
      inject: [ConfigService],
      useFactory: ({ env }: ConfigService<ConfigModel>) => {
        return {
          brokers: env.KAFKA_BROKERS_ARRAY as string[],
          serviceName: NOTIFICATIONS_SERVICE_NAME,
          clientId: NOTIFICATIONS_CLIENT_ID,
          groupId: NOTIFICATION_CONSUMER,
        }
      },
    }),
    AuthCodeModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
