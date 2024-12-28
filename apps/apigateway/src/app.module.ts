import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { PrometheusModule } from '@willsoto/nestjs-prometheus'

import { CacheDatabaseModule } from '@libs/cache'
import { CustomValidationPipe, HttpInterceptor } from '@libs/core'
import { LoggingInterceptor, LokiLogger } from '@lib/loki'
import { CoreAuthModule } from '@lib/core-auth'

import { ConfigModule } from './config/config.module'

import { AuthModule } from './modules/auth/auth.module'
@Module({
  imports: [
    CacheDatabaseModule,
    ConfigModule,
    AuthModule,
    PrometheusModule.register(),
    CoreAuthModule,
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
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    LokiLogger,
  ],
})
export class AppModule {}
