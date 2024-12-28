import { CoreAuthEnvsModel } from '@lib/core-auth/core/model/core-auth.envs.model'
import { LokiEnvsModel } from '@lib/loki/types/env.model'
import { TokensJwtEnvsModel } from '@lib/tokens/model/jwt.envs.model'
import { arrayTransformer, numTransformer } from '@libs/core'
import { Transform } from 'class-transformer'
import { IsArray, IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class ConfigModel implements TokensJwtEnvsModel, CoreAuthEnvsModel, LokiEnvsModel {
  @IsString()
  LOKI_URL: string

  @IsString()
  LOKI_JOB_NAME: string

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
