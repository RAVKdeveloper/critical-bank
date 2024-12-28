import { BaseError, UUID, objToString } from '@libs/core'

export class BankAccountHasAlreadyCreatedError extends BaseError<'bankAccountHasAlreadyCreatedError'> {
  constructor(userId: UUID, accNumber: string) {
    super('bankAccountHasAlreadyCreatedError', { message: objToString({ userId, accNumber }) })
  }
}
