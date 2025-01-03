import { Module } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

import { RepositoryModule } from '@libs/repository'
import { CacheDatabaseModule } from '@libs/cache'
import { LokiLogger } from '@lib/loki'
import { CryptoModule } from '@lib/crypto'
import { KafkaClientModule } from '@lib/micro-clients'
import { ConfigService } from '@libs/config'
import {
  NOTIFICATIONS_CLIENT_ID,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATION_CONSUMER,
} from '@lib/kafka-types'
import { TokensModule } from '@lib/tokens'
import { CoreAuthModule } from '@lib/core-auth'

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
                  producer: {
                    createPartitioner: Partitioners.LegacyPartitioner,
                  },
                },
              }
            },
            name: NOTIFICATIONS_SERVICE_NAME,
          },
        ],
      },
    ]),
    AuthCodeModule,
    TokensModule,
    CoreAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LokiLogger],
})
export class AuthModule {}
