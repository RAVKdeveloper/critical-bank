import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'
import { loadEnvironment } from '@libs/config'
import { ACCOUNT_CONSUMER, ACCOUNT_CLIENT_ID } from '@lib/kafka-types'
import { LokiLogger } from '@lib/loki'
import { AppModule } from './app.module'
import { ConfigModel } from './config/config.model'
import { GrpcPackage } from '@libs/grpc-types'

async function bootstrap() {
  const config = loadEnvironment(ConfigModel)

  const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: config.KAFKA_BROKERS_ARRAY,
        clientId: ACCOUNT_CLIENT_ID,
      },
      consumer: {
        groupId: ACCOUNT_CONSUMER,
        heartbeatInterval: 60000,
        sessionTimeout: 300000,
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
    },
  })
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: GrpcPackage.ACCOUNTS,
      url: config.GRPC_URL,
    },
  })

  kafkaApp.useLogger(kafkaApp.get(LokiLogger))
  grpcApp.useLogger(grpcApp.get(LokiLogger))

  await kafkaApp.listen()
  await grpcApp.listen()
}
bootstrap()
