import { VerifyAuthCodeMsg } from '@lib/kafka-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class VerifyAuthCodeDto implements Omit<VerifyAuthCodeMsg, 'userId'> {
  @ApiProperty({ example: 'f85b5fbb5d' })
  @IsString()
  @Length(10)
  readonly authCode: string
}
