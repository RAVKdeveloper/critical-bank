import { BaseError, UUID, objToString } from '@libs/core'
import { HttpStatus } from '@nestjs/common'

export class UserHasAlreadyBlockedError extends BaseError<'userHasAlreadyBlockedError'> {
  constructor(userId: UUID) {
    super('userHasAlreadyBlockedError', {
      message: objToString({ userId }),
      status: HttpStatus.BAD_REQUEST,
    })
  }
}
