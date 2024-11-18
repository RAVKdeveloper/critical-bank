import { arrayTransformer } from '@libs/core'
import { Transform } from 'class-transformer'
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class ConfigModel {
  @IsString()
  LOKI_ENDPOINT: string

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

  @IsOptional()
  @IsString()
  @IsUrl()
  CLIENT_URL?: string

  @Transform(arrayTransformer)
  @IsArray()
  KAFKA_BROKERS_ARRAY: string[]
}
