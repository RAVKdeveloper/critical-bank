import { Module } from '@nestjs/common'
import { LokiLogger } from '@lib/loki'
import { ConfigModule } from './config/config.module'
import { AccountCreatorModule } from './modules/account-creator/account-creator.module'

@Module({
  imports: [ConfigModule, AccountCreatorModule],
  providers: [LokiLogger],
})
export class AppModule {}
