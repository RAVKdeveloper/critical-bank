import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'

import { RateLimit } from '@lib/rate-limiter'
import { CustomLogger } from '@lib/logger'
import { ConfigService } from '@libs/config'

import type { TgBotModel } from './tg-bot.model'

@Injectable()
export class TgBotService {
  private readonly bot: Telegraf

  constructor(
    private readonly cfg: ConfigService<TgBotModel>,
    private readonly logger: CustomLogger,
  ) {
    this.bot = new Telegraf(this.cfg.env.TG_API_KEY)
  }

  public get Bot(): Telegraf {
    return this.bot
  }

  @RateLimit()
  public async sendNotification(tgId: number, msg: string) {
    await this.bot.telegram.sendMessage(tgId, msg, { parse_mode: 'HTML' })
    this.logger.log('5', `Send message to user ${tgId}`)
  }
}
