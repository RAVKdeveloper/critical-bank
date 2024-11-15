import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

import { NOTIFICATIONS_CLIENT_ID, NOTIFICATION_CONSUMER } from '@lib/kafka-types'
import { CustomLogger } from '@lib/logger'

import { NotificationAppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationAppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
        clientId: NOTIFICATIONS_CLIENT_ID,
      },
      consumer: {
        groupId: NOTIFICATION_CONSUMER,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })

  app.useLogger(app.get(CustomLogger))

  await app.listen()
}
bootstrap()
