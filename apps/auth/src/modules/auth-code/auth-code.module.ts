import { KafkaClientModule } from '@lib/micro-clients'
import { CacheDatabaseModule } from '@libs/cache'
import { ConfigModule, ConfigService } from '@libs/config'
import { RepositoryModule } from '@libs/repository'
import { Module } from '@nestjs/common'
import {
  NOTIFICATIONS_CLIENT_ID,
  NOTIFICATIONS_SERVICE_NAME,
  NOTIFICATION_CONSUMER,
} from '@lib/kafka-types'
import { ConfigModel } from '../../config/config.model'
import { AuthCodeService } from './auth-code.service'
import { CryptoModule } from '@lib/crypto'

@Module({
  imports: [
    CacheDatabaseModule,
    RepositoryModule,
    ConfigModule,
    KafkaClientModule.registerAsync({
      inject: [ConfigService],
      useFactory: ({ env }: ConfigService<ConfigModel>) => {
        return {
          brokers: env.KAFKA_BROKERS_ARRAY as string[],
          serviceName: NOTIFICATIONS_SERVICE_NAME,
          clientId: NOTIFICATIONS_CLIENT_ID,
          groupId: NOTIFICATION_CONSUMER,
        }
      },
    }),
    CryptoModule,
  ],
  providers: [AuthCodeService],
  exports: [AuthCodeService],
})
export class AuthCodeModule {}
