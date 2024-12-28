import { Transform } from 'class-transformer'
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

import { arrayTransformer, numTransformer } from '@libs/core'
import { DbSettings } from '@libs/repository/repository.model'

export class ConfigModel implements DbSettings {
  @IsString()
  DB_NAME: string

  @IsString()
  DB_HOST: string

  @IsString()
  DB_USERNAME: string

  @IsString()
  DB_PASSWORD: string

  @Transform(numTransformer)
  @IsNumber()
  DB_PORT: number

  @Transform(arrayTransformer)
  @IsArray()
  KAFKA_BROKERS_ARRAY: string[]

  @IsString()
  PK_ENCRYPT_KEY: string

  @IsString()
  GRPC_URL: string
}
