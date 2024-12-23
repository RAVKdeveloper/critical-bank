import { Module } from '@nestjs/common'
import { PrivateKeysServiceModule } from './modules/private-keys/private-keys-service.module'
import { ConfigModule } from './config/config.module'
import { LokiLogger } from '@lib/loki'

@Module({
  imports: [PrivateKeysServiceModule, ConfigModule],
  providers: [LokiLogger],
})
export class AppModule {}
