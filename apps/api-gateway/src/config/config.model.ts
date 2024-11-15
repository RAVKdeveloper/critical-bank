import { Transform } from 'class-transformer'
import { IsEmail, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class ConfigModel {
  @IsString()
  LOKI_ENDPOINT: string

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

  @IsOptional()
  @IsString()
  @IsUrl()
  CLIENT_URL?: string
}
