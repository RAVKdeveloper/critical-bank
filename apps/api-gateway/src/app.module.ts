import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'

import { CacheDatabaseModule } from '@libs/cache'
import { RepositoryModule } from '@libs/repository'
import { CustomValidationPipe, HttpInterceptor } from '@libs/core'
import { CustomLoggerModule } from '@lib/logger'

import { ConfigModule } from './config/config.module'

import { AuthModule } from './modules/auth/auth.module'
import { GrafanaModule, LokiHttpExceptionFilter } from '@lib/loki'
import { ConfigService } from '@libs/config'
import { ConfigModel } from './config/config.model'
import { GrafanaModuleOptions } from '@lib/loki/types/module.types'
@Module({
  imports: [
    CacheDatabaseModule,
    ConfigModule,
    AuthModule,
    CustomLoggerModule,
    GrafanaModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<ConfigModel>): GrafanaModuleOptions => ({
        lokiEndpoint: config.env.LOKI_ENDPOINT,
      }),
    }),
    PrometheusModule.register(),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: LokiHttpExceptionFilter,
    },
  ],
})
export class AppModule {}
