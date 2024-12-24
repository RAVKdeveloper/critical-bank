import { Module } from '@nestjs/common'

import { LokiLogger } from '@lib/loki'

import { ConfigModule } from './config/config.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
  imports: [AuthModule, ConfigModule],
  providers: [LokiLogger],
})
export class AuthAppModule {}
