import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'

import { LokiLogger } from '@lib/loki'
import { loadEnvironment } from '@libs/config'
import { AUTH_CLIENT_ID, AUTH_CONSUMER } from '@lib/kafka-types'

import { AuthAppModule } from './app.module'
import { ConfigModel } from './config/config.model'

async function bootstrap() {
  const config = loadEnvironment(ConfigModel)

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthAppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: AUTH_CLIENT_ID,
        brokers: config.AUTH_SERVICE_KAFKA_BROKERS_ARRAY,
      },
      consumer: {
        groupId: AUTH_CONSUMER,
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
