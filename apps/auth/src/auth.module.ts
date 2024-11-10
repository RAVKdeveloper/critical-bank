import { Module } from '@nestjs/common'

import { RepositoryModule } from '@libs/repository'
import { CacheDatabaseModule } from '@libs/cache'
import { CustomLoggerModule } from '@lib/logger'

import { ConfigModule } from './config/config.module'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

@Module({
  imports: [RepositoryModule, ConfigModule, CacheDatabaseModule, CustomLoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
