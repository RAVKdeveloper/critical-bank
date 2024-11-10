import { join } from 'path'
import { NestFactory } from '@nestjs/core'
import { type MicroserviceOptions, Transport } from '@nestjs/microservices'

import { GrpcPackage } from '@libs/grpc-types'

import { AuthModule } from './auth.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      package: GrpcPackage.AUTH,
      protoPath: join(__dirname, '../auth.proto'),
      url: 'localhost:3030',
    },
  })
  await app.listen()
}
bootstrap()
