import { ConfigModule, ConfigService } from '@libs/config'
import { RepositoryModule } from '@libs/repository'
import { Module } from '@nestjs/common'
import { TokensModule } from '@lib/tokens'
import { CacheDatabaseModule } from '@libs/cache'
import { CryptoModule } from '@lib/crypto'
import { KafkaClientModule } from '@lib/micro-clients'
import { Transport } from '@nestjs/microservices'
import {
  NOTIFICATIONS_CLIENT_ID,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATION_CONSUMER,
} from '@lib/kafka-types'

import { AuthCodeModule } from '../auth-code/auth-code.module'
import { AuthRecoveryController } from './auth-recovery.controller'
import { AuthRecoveryService } from './auth-recovery.service'
import { ConfigModel } from '../../config/config.model'

@Module({
  imports: [
    RepositoryModule,
    ConfigModule,
    AuthCodeModule,
    TokensModule,
    CacheDatabaseModule,
    CryptoModule,
    KafkaClientModule.registerAsync([
      {
        clients: [
          {
            inject: [ConfigService],
            useFactory: ({ env }: ConfigService<ConfigModel>) => {
              return {
                transport: Transport.KAFKA,
                name: NOTIFICATIONS_SERVICE_NAME,
                options: {
                  client: {
                    clientId: NOTIFICATIONS_CLIENT_ID,
                    brokers: env.KAFKA_BROKERS_ARRAY as string[],
                  },
                  consumer: {
                    groupId: NOTIFICATION_CONSUMER,
                  },
                },
              }
            },
            name: NOTIFICATIONS_SERVICE_NAME,
          },
        ],
      },
    ]),
  ],
  controllers: [AuthRecoveryController],
  providers: [AuthRecoveryService],
  exports: [AuthRecoveryService],
})
export class AuthRecoveryModule {}
