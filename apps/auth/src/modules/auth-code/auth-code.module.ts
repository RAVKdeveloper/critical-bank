import { KafkaClientModule } from '@lib/micro-clients'
import { CacheDatabaseModule } from '@libs/cache'
import { ConfigModule, ConfigService } from '@libs/config'
import { Module } from '@nestjs/common'
import { Partitioners } from 'kafkajs'
import {
  NOTIFICATIONS_CLIENT_ID,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATION_CONSUMER,
} from '@lib/kafka-types'
import { ConfigModel } from '../../config/config.model'
import { AuthCodeService } from './auth-code.service'
import { CryptoModule } from '@lib/crypto'
import { Transport } from '@nestjs/microservices'

@Module({
  imports: [
    CacheDatabaseModule,
    ConfigModule,
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
    CryptoModule,
  ],
  providers: [AuthCodeService],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
