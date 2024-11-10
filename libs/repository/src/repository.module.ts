import { ClsPluginTransactional } from '@nestjs-cls/transactional'
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm'
import { ClsModule } from 'nestjs-cls'

import { ConfigService } from '@libs/config'

import {
  UserEntity,
  BankAccountEntity,
  BankCardEntity,
  CardLimitsEntity,
  BankCryptoWallet,
  FiatTransactionEntity,
  CryptoTransactionEntity,
} from './entities'
import { DbSettings } from './repository.model'
import { RepositoryService } from './repository.service'

export const entities = [
  UserEntity,
  BankAccountEntity,
  BankCardEntity,
  CardLimitsEntity,
  BankCryptoWallet,
  FiatTransactionEntity,
  CryptoTransactionEntity,
]

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: { env: DbSettings }) => ({
        type: 'postgres',
        host: config.env.DB_HOST,
        port: config.env.DB_PORT,
        username: config.env.DB_USERNAME,
        password: config.env.DB_PASSWORD,
        database: config.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        synchronize: false,
        migrationsTableName: 'migrations',
        autoLoadEntities: true,
      }),
    }),
    TypeOrmModule.forFeature(entities),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          imports: [TypeOrmModule],
          adapter: new TransactionalAdapterTypeOrm({
            dataSourceToken: getDataSourceToken(),
          }),
        }),
      ],
    }),
  ],
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
