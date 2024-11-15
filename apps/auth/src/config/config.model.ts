import { arrayTransformer, numTransformer } from '@libs/core'
import { Transform } from 'class-transformer'
import { IsArray, IsNumber, IsString } from 'class-validator'

export class ConfigModel {
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

  @Transform(arrayTransformer)
  @IsArray()
  KAFKA_BROKERS_ARRAY: string[]

  @Transform(numTransformer)
  @IsNumber()
  AUTH_CODE_LENGTH: number
}
