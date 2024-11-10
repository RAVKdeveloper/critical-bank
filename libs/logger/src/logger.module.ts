import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'

import { ClickhouseModule } from '@lib/clickhouse'

import { CustomLogger } from './logger.service'

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
      },
    }),
    ClickhouseModule,
  ],
})
export class CustomLoggerModule {}
