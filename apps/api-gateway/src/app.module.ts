import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'

import { CacheDatabaseModule } from '@libs/cache'
import { RepositoryModule } from '@libs/repository'
import { CustomValidationPipe, HttpInterceptor } from '@libs/core'

import { ConfigModule } from './config/config.module'

@Module({
  imports: [CacheDatabaseModule, ConfigModule, RepositoryModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
  ],
})
export class AppModule {}
