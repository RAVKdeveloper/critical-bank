import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { LokiService } from '../loki.service'
import { LokiLogError } from '../types/loki.types'
import { randomUUID } from 'crypto'

@Injectable()
@Catch(HttpException)
export class LokiHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(LokiHttpExceptionFilter.name)

  constructor(private readonly lokiService: LokiService) {}

  public async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request: Request = ctx.getRequest()
    const status = exception.getStatus()
    const { method, path } = request
    const correlationKey = randomUUID()
    const response = ctx.getResponse<Response>()

    this.logger.error(`Http Exception: ${exception}`)

    await this.lokiService.push<LokiLogError>({
      data: {
        statusCode: exception.getStatus(),
        message: exception.message,
        name: exception.name,
      },
      timestamp: new Date(),
      type: 'http',
      key: correlationKey,
      status: response.statusCode,
      method,
      path,
      time: 0,
    })

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    })
  }
}
