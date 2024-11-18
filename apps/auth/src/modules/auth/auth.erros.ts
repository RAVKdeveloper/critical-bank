import { BaseError, objToString } from '@libs/core'
import { HttpStatus } from '@nestjs/common'

export class IdentificationUserError extends BaseError<'identificationUserError'> {
  constructor(identifierObj: Record<string, any>) {
    super('identificationUserError', {
      message: objToString({ ...identifierObj }),
      status: HttpStatus.BAD_REQUEST,
    })
  }
}

export class UserHasAlreadyExistError extends BaseError<'userHasAlreadyExistError'> {
  constructor(identifierObj: Record<string, any>) {
    super('userHasAlreadyExistError', {
      message: objToString({ ...identifierObj }),
      status: HttpStatus.FORBIDDEN,
    })
  }
}
