import { Module } from '@nestjs/common'
import { MongoRepoModule } from '@lib/mongo-repo'

import { NotificationsController } from './notifications.controller'
import { NotificationsService } from './notifications.service'
import { TgNotificationsModule } from '../tg-notifications/tg-notifications.module'
import { EmailNotificationsModule } from '../email-notifications/email-notifications.module'
import { CustomLoggerModule } from '@lib/logger'

@Module({
  imports: [TgNotificationsModule, MongoRepoModule, EmailNotificationsModule, CustomLoggerModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
