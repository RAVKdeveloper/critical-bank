import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

import { NOTIFICATIONS_CLIENT_ID, NOTIFICATION_CONSUMER } from '@lib/kafka-types'
import { LokiLogger } from '@lib/loki'
import { loadEnvironment } from '@libs/config'

import { NotificationAppModule } from './app.module'
import { ConfigModel } from './config/config.model'

async function bootstrap() {
  const config = loadEnvironment(ConfigModel)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationAppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.KAFKA_BROKERS_ARRAY,
        clientId: NOTIFICATIONS_CLIENT_ID,
      },
      consumer: {
        groupId: NOTIFICATION_CONSUMER,
        heartbeatInterval: 60000,
        sessionTimeout: 300000,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })

  app.useLogger(app.get(LokiLogger))

  await app.listen()
}
bootstrap()
