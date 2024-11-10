import { Global, Module, Provider } from '@nestjs/common'
import { ClickHouseClient, createClient } from '@clickhouse/client'

import { ConfigService } from '@libs/config'

import { ClickhouseService } from './clickhouse.service'

import type { ClickHouseEnvs } from './interface/default.envs'

const ClickhouseClientProvider: Provider = {
  provide: ClickHouseClient,
  useFactory: <T extends ClickHouseEnvs>(cfg: { env: T }): ClickHouseClient => {
    return createClient({
      url: cfg.env.CLICKHOUSE_URL,
      username: cfg.env.CLICKHOUSE_USERNAME,
      password: cfg.env.CLICKHOUSE_PASSWORD,
      database: cfg.env.CLICKHOUSE_DATABASE,
    })
  },
  inject: [ConfigService],
}

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [ClickhouseClientProvider, ClickhouseService],
  exports: [ClickhouseService, ClickhouseClientProvider],
})
export class ClickhouseModule {}
