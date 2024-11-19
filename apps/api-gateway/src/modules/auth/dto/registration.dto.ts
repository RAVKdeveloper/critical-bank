import { RegistrationMsg } from '@libs/grpc-types'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class UserRegistrationDto implements RegistrationMsg {
  @ApiProperty({ example: 'critical@gmail.com' })
  @IsEmail()
  readonly email: string

  @ApiProperty({ example: '+79323454550', required: false })
  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string

  @ApiProperty({
    description: 'User telegram id(from mini app)',
    example: '7432435565',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  readonly tgId?: number

  @ApiProperty({ example: 'Ivan' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly userName: string

  @ApiProperty({ example: 'Ivanov' })
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly userSurname: string

  @ApiProperty({ example: 'Ivanovich', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly userLastName?: string

  @ApiProperty({ example: '12345Lw2324' })
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  readonly password: string
}
