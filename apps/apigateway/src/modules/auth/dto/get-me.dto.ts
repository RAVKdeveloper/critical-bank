import { Expose, Type } from 'class-transformer'
import { ResUserMsg } from '@lib/kafka-types'
import { IsBoolean, IsEmail, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator'
import { IsNullable, toDtoSync } from '@libs/core'

type User = Omit<ResUserMsg['user'], 'accounts' | 'wallets'>

export class GetMeDto implements User {
  @Expose()
  @IsNullable()
  readonly tgId: number

  @Expose()
  @IsString()
  readonly userName: string

  @Expose()
  @IsString()
  readonly userSurname: string

  @Expose()
  @IsNullable()
  readonly userLastName: string

  @Expose()
  @IsEmail()
  readonly email: string

  @Expose()
  @IsNullable()
  readonly phoneNumber: string

  @Expose()
  @IsBoolean()
  readonly isBlocked: boolean

  @Expose()
  @IsBoolean()
  readonly isVerify: boolean

  @Expose()
  @IsUUID()
  readonly id: `${string}-${string}-${string}-${string}-${string}`

  @Expose()
  @IsString()
  readonly createdAt: Date

  @Expose()
  @IsString()
  readonly updatedAt: Date

  @Expose()
  @IsNullable()
  readonly deletedAt: Date
}

export class ResponseMeDto {
  @Expose()
  @IsNumber()
  readonly timestamp: number

  @Expose()
  @Type(() => GetMeDto)
  @ValidateNested()
  readonly user: GetMeDto
}

export const getUserMe = <T extends ResponseMeDto>(data: T) => {
  return toDtoSync(ResponseMeDto, data)
}
