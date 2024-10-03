import { HttpStatus } from '@nestjs/common'
import { BaseError, ErrorOptions } from './errors.core'

export class InternalServerError<E> extends BaseError<E> {
  constructor(error: E, options?: Omit<ErrorOptions, 'status'>) {
    super(error, { ...options, status: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}

export class BadRequestError extends BaseError<'badRequest'> {
  constructor(message: string) {
    super('badRequest', { status: HttpStatus.BAD_REQUEST, message })
  }
}

export class NotFoundError extends BaseError<'notFoundError'> {
  constructor(msg: string) {
    super('notFoundError', { message: msg, status: HttpStatus.NOT_FOUND })
  }
}

export class ForbiddenError extends BaseError<'forbiddenError'> {
  constructor(msg: string) {
    super('forbiddenError', { message: msg, status: HttpStatus.FORBIDDEN })
  }
}
