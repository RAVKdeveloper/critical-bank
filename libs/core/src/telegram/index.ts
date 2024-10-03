import { IsNumber, IsOptional, IsString } from 'class-validator'

import { Expose } from 'class-transformer'

export class ContextUser {
  @IsNumber()
  id: number
}

export class ContextTelegramUser {
  @Expose()
  @IsNumber()
  id: number

  @Expose()
  @IsOptional()
  @IsString()
  first_name?: string

  @Expose()
  @IsOptional()
  @IsString()
  last_name?: string

  @Expose()
  @IsString()
  username: string
}
