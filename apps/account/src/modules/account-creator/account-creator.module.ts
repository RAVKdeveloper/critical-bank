import { LokiLogger } from '@lib/loki'
import { RepositoryModule } from '@libs/repository'
import { Module } from '@nestjs/common'
import { AccountCreatorConsumer } from './account-creator.consumer'
import { AccountCreatorService } from './account-creator.service'
import { CryptoModule } from '@lib/crypto'
import { Web3Module } from '@lib/web3'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigService } from '@libs/config'
import { ConfigModel } from '../../config/config.model'
import {
  PRIVATE_KEYS_SERVICE_NAME,
  PRIVATE_KEYS_CLIENT_ID,
  PRIVATE_KEYS_CONSUMER,
} from '@lib/kafka-types'
import { Partitioners } from 'kafkajs'

@Module({
  imports: [
    RepositoryModule,
    CryptoModule,
    Web3Module,
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        useFactory: ({ env }: ConfigService<ConfigModel>) => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: PRIVATE_KEYS_CLIENT_ID,
                brokers: env.KAFKA_BROKERS_ARRAY as string[],
              },
              consumer: {
                groupId: PRIVATE_KEYS_CONSUMER,
              },
              producer: {
                createPartitioner: Partitioners.LegacyPartitioner,
              },
            },
          }
        },
        name: PRIVATE_KEYS_SERVICE_NAME,
      },
    ]),
  ],
  controllers: [AccountCreatorConsumer],
  providers: [LokiLogger, AccountCreatorService],
  exports: [AccountCreatorService],
})
export class AccountCreatorModule {}
