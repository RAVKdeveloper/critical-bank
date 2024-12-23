import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { loadEnvironment } from '@libs/config'
import { ConfigModel } from './config/config.model'
import { GrpcPackage } from '@libs/grpc-types'
import { PRIVATE_KEYS_CLIENT_ID, PRIVATE_KEYS_CONSUMER } from '@lib/kafka-types'
import { Partitioners } from 'kafkajs'
import { LokiLogger } from '@lib/loki'

async function bootstrap() {
  const config = loadEnvironment(ConfigModel)

  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: config.GRPC_APP_URL,
      package: GrpcPackage.PRIVATE_KEYS,
    },
  })
  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: PRIVATE_KEYS_CLIENT_ID,
        brokers: config.KAFKA_BROKERS_ARRAY,
      },
      consumer: {
        groupId: PRIVATE_KEYS_CONSUMER,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })

  grpcApp.useLogger(grpcApp.get(LokiLogger))
  kafkaApp.useLogger(kafkaApp.get(LokiLogger))

  await grpcApp.listen()
  await kafkaApp.listen()
}
bootstrap()
