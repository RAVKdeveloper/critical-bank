import { join } from 'path'
import { Module } from '@nestjs/common'

import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

import { ConfigService } from '@libs/config'

import { ConfigModule } from '../../config/config.module'
import { ConfigModel } from '../../config/config.model'

import { EmailNotificationService } from './email-notification.service'
import { RateLimiterModule } from '@lib/rate-limiter'

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: ({ env }: ConfigService<ConfigModel>) => {
        return {
          transport: {
            host: env.EMAIL_HOST,
            auth: {
              user: env.EMAIL_LOGIN,
              pass: env.EMAIL_PASSWORD,
            },
            secure: true,
            port: env.EMAIL_PORT,
          },
          defaults: {
            from: `"No Reply" <${env.EMAIL_SENDER}>`,
          },
          template: {
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
            dir: join(__dirname, 'templates'),
          },
        }
      },
    }),
    RateLimiterModule.forRoot({ requestsPerSecond: 2000 }),
  ],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService],
})
export class EmailNotificationsModule {}
