import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator'

export class BasicSendDto<T extends object> {
  @IsEmail()
  readonly to: string

  @IsOptional()
  @IsString()
  readonly subject?: string

  @IsOptional()
  @IsObject()
  readonly context?: T
}
