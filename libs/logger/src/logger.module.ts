import { Module } from '@nestjs/common'
import { LoggerModule } from 'nestjs-pino'

import { CustomLogger } from './logger.service'
import { GrafanaModule } from '@lib/loki'
import { ConfigService } from '@libs/config'

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: { target: 'pino-pretty' },
      },
    }),
    GrafanaModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<{ LOKI_ENDPOINT: string }>) => ({
        lokiEndpoint: config.env.LOKI_ENDPOINT,
      }),
    }),
  ],
})
export class CustomLoggerModule {}
