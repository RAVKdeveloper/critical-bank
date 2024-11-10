import { Inject, Injectable } from '@nestjs/common'
import { ClickHouseClient } from '@clickhouse/client'

import type { Table, TableEntities } from './interface/clickhouse'

@Injectable()
export class ClickhouseService {
  constructor(@Inject(ClickHouseClient) private readonly client: ClickHouseClient) {}

  async insert<T extends Table>(table: T, values: TableEntities[T][]) {
    await this.client.insert({
      table,
      values,
      format: 'JSONEachRow',
    })
  }

  async query<T>(query: string): Promise<T[]> {
    const result = await this.client.query({ query, format: 'JSONEachRow' })
    return await result.json<T>()
  }
}
