import { arrayTransformer, numTransformer } from '@libs/core'
import { Transform } from 'class-transformer'
import { IsArray, IsNumber, IsString } from 'class-validator'
import type { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'
import { CoreAuthEnvsModel } from '@lib/core-auth/core/model/core-auth.envs.model'

export class ConfigModel implements TokensJwtEnvsModel, CoreAuthEnvsModel {
  @IsString()
  AUTH_REDIS_HOST: string

  @Transform(numTransformer)
  @IsNumber()
  AUTH_REDIS_PORT: number

  @Transform(numTransformer)
  @IsNumber()
  REFRESH_TOKENS_CACHE_TTL: number

  @IsString()
  ACCESS_SECRET_KEY: string

  @IsString()
  ACCESS_EXPIRATION_TIME: string

  @IsString()
  REFRESH_SECRET_KEY: string

  @IsString()
  REFRESH_EXPIRATION_TIME: string

  @IsString()
  REFRESH_TOKEN_ENCRYPT_KEY: string

  @IsString()
  ACCESS_TOKEN_ENCRYPT_KEY: string

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

  @Transform(arrayTransformer)
  @IsArray()
  AUTH_SERVICE_KAFKA_BROKERS_ARRAY: string[]
}
