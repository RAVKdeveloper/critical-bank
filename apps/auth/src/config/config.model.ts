import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

import type { ClickHouseEnvs } from '@lib/clickhouse/interface/default.envs'

export class ConfigModel implements ClickHouseEnvs {
  @IsString()
  CLICKHOUSE_DATABASE: string

  @IsString()
  CLICKHOUSE_URL: string

  @IsString()
  CLICKHOUSE_USERNAME: string

  @IsString()
  CLICKHOUSE_PASSWORD: string

  @IsString()
  DB_NAME: string

  @IsString()
  DB_HOST: string

  @IsString()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  @IsNumber()
  @Transform(p => Number(p.value))
  DB_PORT: number

  @IsNumber()
  @Transform(p => Number(p.value))
  PORT: number

  @IsNumber()
  @Transform(p => Number(p.value))
  REDIS_PORT: number

  @IsString()
  REDIS_HOST: string

  @IsString()
  REDIS_PASSWORD: string
}
