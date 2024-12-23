import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { randomUUID as uuidv4 } from 'node:crypto'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

import { objToString } from '@libs/core'
import { LokiLogger } from '../logger/loki.logger'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LokiLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest()
    const response = context.switchToHttp().getResponse()
    const { ip, method, url, body } = request
    const correlationId = uuidv4()
    request.correlationId = correlationId

    const metricsEndpoint = '/api/metrics'

    if (!(url as string).startsWith(metricsEndpoint)) {
      this.loggerService.log(`Incoming request: ${method} ${url} ${correlationId}`, {
        request: {
          body,
          ip,
        },
      })
    }

    const now = Date.now()

    return next.handle().pipe(
      tap(responseBody => {
        const duration = Date.now() - now

        if (!(url as string).startsWith(metricsEndpoint)) {
          this.loggerService.log(
            `Response sent: ${method} ${url} ${correlationId} ${response.statusCode}`,
            {
              response: {
                body: responseBody,
                statusCode: response.statusCode,
                duration,
              },
            },
          )
        }
      }),
      catchError(error => {
        const duration = Date.now() - now
        const statusCode = error?.status || HttpStatus.INTERNAL_SERVER_ERROR

        this.loggerService.error(
          `Error occurred: ${method} ${url} ${correlationId} ${statusCode}`,
          objToString({
            response: {
              message: error.message,
              stack: error.stack,
              statusCode,
            },
            duration,
          }),
        )

        return throwError(() => error)
      }),
    )
  }
}
