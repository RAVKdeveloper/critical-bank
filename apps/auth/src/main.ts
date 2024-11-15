import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

import { GrpcPackage } from '@libs/grpc-types'
import { CustomLogger } from '@lib/logger'

import { AuthAppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthAppModule, {
    transport: Transport.GRPC,
    options: {
      package: GrpcPackage.AUTH,
      protoPath: join(__dirname, '../auth.proto'),
      url: 'localhost:3030',
    },
  })

  app.useLogger(app.get(CustomLogger))

  await app.listen()
}
bootstrap()
