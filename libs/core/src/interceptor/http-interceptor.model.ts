/* eslint-disable @typescript-eslint/no-explicit-any */

import { ControllerResponse, FailResponseBody } from '@libs/core/controller'
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { Observable, catchError, map, of } from 'rxjs'

import { objToString } from '../utils'

@Injectable()
export class HttpInterceptor implements NestInterceptor {
  private logger = new Logger(HttpInterceptor.name)

  constructor() {}

  public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const res: Response = context.switchToHttp().getResponse()

    return next
      .handle()
      .pipe(
        map((data: ControllerResponse<unknown> | undefined | null) => {
          if (!data) {
            return null
          }

          if (data.headers) {
            for (const [header, value] of Object.entries(data.headers)) {
              res.setHeader(header, value)
            }
          }

          if (data.body.success) {
            res.status(200)
            return data.body
          }

          throw { body: data.body, status: data.status }
        }),
      )
      .pipe(
        catchError((err: Error | { body: FailResponseBody<string>; status: number }) => {
          if (err instanceof Error) {
            let status = HttpStatus.INTERNAL_SERVER_ERROR
            let message = err.message
            if (err instanceof HttpException) {
              const response = err.getResponse()
              if (typeof response === 'object' && hasMessage(response)) {
                message = objToString(response.message)
              } else {
                message = objToString(response)
              }
              status = err.getStatus()
            }

            this.logger.error(`INTERNAL_SERVER_ERROR Error(): ${message};\nStack: ${err.stack}`)
            res.status(status)
            return of(message)
          }

          res.setHeader('Content-Type', 'application/json')

          if (err?.body && !err.body.success) {
            this.logger.error(`Error: ${JSON.stringify(err)}`)
            res.status(err.status)
            return of(objToString(err.body))
          }

          const unknownError = objToString(err)
          this.logger.error(`INTERNAL_SERVER_ERROR unknown: ${unknownError}`)
          res.status(HttpStatus.INTERNAL_SERVER_ERROR)
          return of(unknownError)
        }),
      )
  }
}

function hasMessage(v: object): v is { message: object | string } {
  return (v as any).hasOwnProperty('message')
}
