import { Module } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'

import { ConfigService, ConfigModule } from '@libs/config'
import { KafkaClientModule } from '@lib/micro-clients'
import { Partitioners } from 'kafkajs'
import { AUTH_CLIENT_ID, AUTH_CONSUMER, AUTH_SERVICE_NAME } from '@lib/kafka-types'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ConfigModel } from '../../config/config.model'
import { CoreAuthModule } from '@lib/core-auth'

@Module({
  imports: [
    ConfigModule,
    KafkaClientModule.registerAsync([
      {
        clients: [
          {
            inject: [ConfigService],
            useFactory: ({ env }: ConfigService<ConfigModel>) => {
              return {
                transport: Transport.KAFKA,
                name: AUTH_SERVICE_NAME,
                options: {
                  client: {
                    clientId: AUTH_CLIENT_ID,
                    brokers: env.KAFKA_BROKERS_ARRAY as string[],
                  },
                  consumer: {
                    groupId: AUTH_CONSUMER,
                  },
                  producer: {
                    createPartitioner: Partitioners.LegacyPartitioner,
                  },
                },
              }
            },
            name: AUTH_SERVICE_NAME,
          },
        ],
      },
    ]),
    CoreAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
