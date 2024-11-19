import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { LoginMsg } from '@lib/kafka-types'

export class LoginUserDto implements LoginMsg {
  @ApiProperty({ example: 'critical@gmail.com' })
  @IsEmail()
  readonly email?: string

  @ApiProperty({ example: '+79323454550' })
  @IsOptional()
  @IsPhoneNumber()
  readonly phoneNumber?: string

  @ApiProperty({ example: '12345Lw2324' })
  @IsString()
  @MinLength(10)
  @MaxLength(120)
  readonly password: string
}
