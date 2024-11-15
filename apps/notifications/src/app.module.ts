import { Module } from '@nestjs/common'
import { MongoRepoModule } from '@lib/mongo-repo'
import { CustomLoggerModule } from '@lib/logger'

import { NotificationsModule } from './modules/common-notifications/notifications.module'
import { ConfigModule } from './config/config.module'

@Module({
  imports: [NotificationsModule, MongoRepoModule, ConfigModule, CustomLoggerModule],
})
export class NotificationAppModule {}
