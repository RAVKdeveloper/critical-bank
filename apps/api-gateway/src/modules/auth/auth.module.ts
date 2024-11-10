import { Module } from '@nestjs/common'

import { GrpcClientModule } from '@lib/micro-clients'
import { GrpcPackage, AUTH_SERVICE_NAME } from '@libs/grpc-types'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    GrpcClientModule.register({
      serviceName: AUTH_SERVICE_NAME,
      package: GrpcPackage.AUTH,
      protoPath: '../auth.proto',
      url: 'localhost:3030',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
