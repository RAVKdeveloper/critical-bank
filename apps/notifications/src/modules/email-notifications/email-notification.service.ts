import { Injectable } from '@nestjs/common'

import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer'
import { RateLimit } from '@lib/rate-limiter'
import { AUTH_CODE_EX_TIME, BLOCK_LINK_URL, PASSWORD_RESET_LINK_URL } from '@libs/constants'

import type { NotificationInterface } from '../../interface/notification.interface'
import type { BasicSendDto } from './dto/basic-send.dto'

@Injectable()
export class EmailNotificationService implements NotificationInterface {
  constructor(private readonly mailer: MailerService) {}

  public async sendSuccessfulRegistration<T extends Record<string, unknown>>(dto: BasicSendDto<T>) {
    const msg: ISendMailOptions = {
      to: dto.to,
      subject: dto.subject ?? 'Successful registered!',
      template: './registration',
      context: dto.context ?? { email: dto.to, time: new Date().toDateString() },
    }

    await this.send(msg)
  }

  public async sendAuthCode<T extends Record<string, unknown>>(dto: BasicSendDto<T>, code: string) {
    const msg: ISendMailOptions = {
      to: dto.to,
      subject: dto.subject ?? 'Verification code',
      template: './auth-code',
      context: dto.context ?? {
        email: dto.to,
        code,
        expirationTime: AUTH_CODE_EX_TIME / 1000 / 60,
        date: new Date().toDateString(),
      },
    }

    await this.send(msg)
  }

  public async sendLogin<T extends Record<string, unknown>>(
    dto: BasicSendDto<T>,
    device: string,
    ip: string,
  ) {
    const msg: ISendMailOptions = {
      to: dto.to,
      subject: dto.subject ?? 'Successful Login!',
      template: './login',
      context: dto.context ?? {
        email: dto.to,
        loginTime: new Date().toDateString(),
        blockAccLink: BLOCK_LINK_URL,
        passwordResetRink: PASSWORD_RESET_LINK_URL,
        deviceType: device,
        location: ip,
      },
    }

    await this.send(msg)
  }

  public async sendOtherMsg<T extends Record<string, unknown>>(dto: BasicSendDto<T>) {
    const msg: ISendMailOptions = {
      to: dto.to,
      subject: dto.subject ?? 'Critical Bank',
      template: './other',
      context: dto.context ?? {
        text: 'Dear customer!',
        title: 'Welcome to Critical Bank!',
      },
    }

    await this.send(msg)
  }

  // @RateLimit()
  public async send(msg: ISendMailOptions) {
    await this.mailer.sendMail(msg)
  }
}
