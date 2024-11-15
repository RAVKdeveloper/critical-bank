import { Transform } from 'class-transformer'
import { IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

import { numTransformer } from '@libs/core'

export class ConfigModel {
  @IsString()
  LOKI_ENDPOINT: string

  @IsString()
  MONGO_URL: string

  @IsString()
  TG_BOT_KEY: string

  @IsString()
  EMAIL_HOST: string

  @IsString()
  EMAIL_LOGIN: string

  @IsString()
  EMAIL_PASSWORD: string

  @IsNumber()
  @Transform(numTransformer)
  EMAIL_PORT: number

  @IsEmail()
  EMAIL_SENDER: string
}
