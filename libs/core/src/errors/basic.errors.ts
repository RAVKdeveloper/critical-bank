import { HttpStatus } from '@nestjs/common'
import { BaseError, ErrorOptions } from './errors.core'
import { objToString } from '../utils'
import { UUID } from '../types'

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

export class RateLimiterError extends BaseError<'rateLimiterError'> {
  constructor(error: any) {
    super('rateLimiterError', { message: objToString({ error }) })
  }
}

export class NotFoundUserError extends BaseError<'notFoundUserError'> {
  constructor(userId: string) {
    super('notFoundUserError', { message: objToString({ userId }), status: HttpStatus.NOT_FOUND })
  }
}

export class InvalidAuthCodeError extends BaseError<'invalidAuthCodeError'> {
  constructor(code: string) {
    super('invalidAuthCodeError', { message: objToString({ authCode: code }) })
  }
}

export class UserIsBlockedError extends BaseError<'userIsBlockedError'> {
  constructor(userId: string) {
    super('userIsBlockedError', { message: objToString({ userId }), status: HttpStatus.FORBIDDEN })
  }
}
