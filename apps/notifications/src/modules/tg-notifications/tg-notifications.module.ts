import { Module } from '@nestjs/common'

import { TgBotModule } from '@lib/tg-bot'

import { ConfigModule } from '../../config/config.module'

import { TgNotificationsService } from './tg-notifications.service'

@Module({
  imports: [TgBotModule, ConfigModule],
  providers: [TgNotificationsService],
  exports: [TgNotificationsService],
})
export class TgNotificationsModule {}
