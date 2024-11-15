import { Module } from '@nestjs/common'
import { TgBotService } from './tg-bot.service'
import { RateLimiterModule } from '@lib/rate-limiter'
import { ConfigModule } from '@libs/config'
import { CustomLoggerModule } from '@lib/logger'

@Module({
  imports: [
    RateLimiterModule.forRoot({ requestsPerSecond: 1000 }),
    ConfigModule,
    CustomLoggerModule,
  ],
  providers: [TgBotService],
  exports: [TgBotService],
})
export class TgBotModule {}
