import { LokiService } from '@lib/loki'
import { Inject, Injectable } from '@nestjs/common'
import { PARAMS_PROVIDER_TOKEN, Params, PinoLogger } from 'nestjs-pino'

@Injectable()
export class CustomLogger extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) private params: Params,
    private readonly lokiService: LokiService,
  ) {
    super(params)
  }

  public async log(
    level: string,
    message: string,
    data: unknown = {},
    userId?: string,
    service?: string,
  ) {
    try {
      await this.lokiService.push({
        key: level,
        method: `service - ${service}`,
        path: service,
        status: 0,
        timestamp: new Date(),
        type: 'application',
        time: 0,
        userId,
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  public async error(msg: string, data?: any, userId?: string, service?: string) {
    return this.log('5', msg, data, userId, service)
  }

  public async warn(msg: string, data?: any, userId?: string, service?: string) {
    return this.log('4', msg, data, userId, service)
  }

  public async info(msg: string, data?: any, userId?: string, service?: string) {
    return this.log('5', msg, data, userId, service)
  }
}
