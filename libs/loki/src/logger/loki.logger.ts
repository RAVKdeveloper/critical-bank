import { ConfigService } from '@libs/config'
import { Injectable, LoggerService } from '@nestjs/common'
import * as colors from 'colors'
import { createLogger, format, Logger } from 'winston'
// @ts-expect-error
import * as LokiTransport from 'winston-loki'
import { LokiEnvsModel } from '../types/env.model'

@Injectable()
export class LokiLogger implements LoggerService {
  private readonly loggerLoki: Logger

  constructor(private readonly cfg: ConfigService<LokiEnvsModel>) {
    this.loggerLoki = createLogger({
      level: 'info',
      format: format.combine(format.timestamp(), format.json(), LokiLogger.logFormat()),
      transports: [
        new LokiTransport({
          host: cfg.env.LOKI_URL,
          labels: { job: cfg.env.LOKI_JOB_NAME },
          json: true,
        }),
      ],
    })
  }

  public async log(message: any, ...optionalParams: any[]) {
    this.loggerLoki.info(message, ...optionalParams)
  }

  public async error(message: any, ...optionalParams: any[]) {
    this.loggerLoki.error(message, ...optionalParams)
  }

  public async warn(message: any, ...optionalParams: any[]) {
    this.loggerLoki.warn(message, ...optionalParams)
  }

  public async debug(message: any, ...optionalParams: any[]) {
    this.loggerLoki.debug(message, ...optionalParams)
  }

  public static logFormat(): any {
    return format.printf(({ level, message, context }: any) => {
      const baseMessage = `[${level}] ${message}`
      const request = ` Request: ${JSON.stringify(context?.request ?? {})}`
      const response = ` Response: ${JSON.stringify(context?.response ?? {})}`

      let coloredMessage: string
      switch (level) {
        case 'error':
          coloredMessage = colors.red(baseMessage)
          break
        case 'warn':
          coloredMessage = colors.yellow(baseMessage)
          break
        case 'info':
          coloredMessage = colors.green(baseMessage)
          break
        case 'debug':
          coloredMessage = colors.blue(baseMessage)
          break
        default:
          coloredMessage = baseMessage
      }

      const uuidPattern =
        /\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b/g
      const uuidMatches = coloredMessage.match(uuidPattern)

      if (uuidMatches && uuidMatches.length > 0) {
        const correlationId = uuidMatches[uuidMatches.length - 1]
        const highlightedMessage = coloredMessage.replace(
          correlationId,
          colors.magenta(correlationId),
        )
        coloredMessage = highlightedMessage
      }

      let finalLog = `${coloredMessage}`
      if (request) {
        finalLog += `\n${colors.gray(request)}`
      }
      if (response) {
        finalLog += `\n${colors.cyan(response)}`
      }

      return finalLog
    })
  }
}
