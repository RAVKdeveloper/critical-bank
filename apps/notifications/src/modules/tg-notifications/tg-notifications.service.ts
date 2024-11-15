import { Injectable } from '@nestjs/common'

import { TgBotService } from '@lib/tg-bot'
import { BLOCK_LINK_URL, PASSWORD_RESET_LINK_URL } from '@libs/constants'

import { NotificationInterface } from '../../interface/notification.interface'

@Injectable()
export class TgNotificationsService implements NotificationInterface {
  constructor(private readonly bot: TgBotService) {}

  public async sendLogin(tgId: number, device: string, ip: string) {
    const msg = `
    <html lang='en'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Critical Bank - Login Activity</title>
    <style>
      body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f2f2f2; } .container
      { max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff; border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } h1 { color: #333; text-align: center;
      margin-bottom: 20px; } p { line-height: 1.6; margin-bottom: 15px; color: #555; }
      .activity-details { margin-bottom: 20px; } .activity-details strong { display: block;
      margin-bottom: 5px; } .button { display: block; width: 100%; padding: 12px 20px;
      background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;
      text-align: center; font-weight: bold; text-decoration: none; } .button:hover { opacity: 0.8;
      }
    </style>
  </head>
  <body>

    <div class='container'>
      <h1>Critical Bank - Login Activity</h1>

      <p>This telegram confirms that your Critical Bank account was accessed from a new device or
        location on
        ${new Date().toDateString()}.</p>

      <div class='activity-details'>
        <strong>Device:</strong>
        ${device}
        <strong>Location:</strong>
        ${ip}
      </div>

      <p>If this was not you, please change your password immediately by visiting:</p>

      <a href='${PASSWORD_RESET_LINK_URL}' class='button'>Change Password</a>

      <p>We encourage you to always be vigilant about your account security.</p>

      <a href='${BLOCK_LINK_URL}' class='button'>Block Account</a>

      <p>Sincerely,</p>
      <p>The Critical Bank Team</p>
    </div>

  </body>
</html>
    `

    await this.send(tgId, msg)
  }

  public async send(tgId: number, msg: string) {
    return await this.bot.sendNotification(tgId, msg)
  }
}
