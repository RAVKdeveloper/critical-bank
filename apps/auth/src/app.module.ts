import { Module } from '@nestjs/common'

import { CustomLoggerModule } from '@lib/logger'

import { ConfigModule } from './config/config.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [AuthModule, ConfigModule, CustomLoggerModule],
})
export class AuthAppModule {}
