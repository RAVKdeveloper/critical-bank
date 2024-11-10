import { Inject, Injectable } from '@nestjs/common'
import { PARAMS_PROVIDER_TOKEN, Params, PinoLogger } from 'nestjs-pino'

import { ClickhouseService, Table, Logs } from '@lib/clickhouse'

@Injectable()
export class CustomLogger extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) private params: Params,
    private readonly client: ClickhouseService,
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
      if (message && message.trim()) {
        const log = new Logs({ userId, level, message, data, service })

        return await this.client.insert(Table.LOGS, [log])
      } else {
        this.logger.error('Пустой лог, не отправляем в Clickhouse')
      }
    } catch (error) {
      this.logger.error(error, { message, data })
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
