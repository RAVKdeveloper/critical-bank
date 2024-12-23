import { ConfigService } from '@libs/config'
import { UserEntity } from '@libs/repository'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { ClientKafka } from '@nestjs/microservices'
import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { CryptoService } from '@lib/crypto'
import { AUTH_CODE_CACHE_KEY, AUTH_CODE_EX_TIME } from '@libs/constants'
import type { UUID } from '@libs/core/types'
import { ConfigModel } from '../../config/config.model'
import {
  AuthServiceMsgBrokerSubsArr,
  NOTIFICATIONS_SERVICE_NAME,
  NotificationMsgContext,
  NotificationMsgPattern,
  SendAuthCodeMsg,
} from './broker-subs'

@Injectable()
export class AuthCodeService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @Inject(CACHE_MANAGER) private readonly authCodeCache: Cache,
    private readonly cfg: ConfigService<ConfigModel>,
    private readonly cryptoService: CryptoService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly notificationClient: ClientKafka,
  ) {}

  public async onModuleInit() {
    const requestPatterns = AuthServiceMsgBrokerSubsArr
    requestPatterns.forEach(pattern => {
      this.notificationClient.subscribeToResponseOf(pattern)
    })
    await this.notificationClient.connect()
  }

  public async onApplicationShutdown() {
    await this.notificationClient.close()
  }

  public async createAndSendAuthCode(userId: UUID, user: UserEntity): Promise<void> {
    const cacheKey = this.getCacheKey(userId)
    let cacheVal: string | undefined = await this.authCodeCache.get(cacheKey)

    const randomCode = this.genRandomCode(this.cfg.env.AUTH_CODE_LENGTH)
    const hashCode = await this.cryptoService.hash.lightHash(randomCode, 'base58')

    cacheVal = hashCode

    if (cacheKey) {
      await this.authCodeCache.del(cacheKey)
    }

    await this.authCodeCache.set(cacheKey, cacheVal, AUTH_CODE_EX_TIME)

    const objWithEmailAndTgId = this.getSendCredentials(user)

    const notificationMsg: SendAuthCodeMsg = {
      userId: userId,
      msgContext: NotificationMsgContext.AUTH_CODE,
      body: randomCode,
      ...objWithEmailAndTgId,
    }

    this.notificationClient.emit(NotificationMsgPattern.BASIC_SEND_NOTIFICATION, notificationMsg)
  }

  public async verifyAuthCode(userId: UUID, authCode: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(userId)
    const cacheVal: string | undefined = await this.authCodeCache.get(cacheKey)

    if (!cacheVal) {
      return false
    }

    const hashFromNewCode = await this.cryptoService.hash.lightHash(authCode, 'base58')

    if (hashFromNewCode !== cacheVal) {
      return false
    }

    return true
  }

  private getSendCredentials(user: UserEntity) {
    const obj: Record<string, string | number> = {
      email: undefined,
      tgId: undefined,
    }

    if (user.email) obj.email = user.email

    if (user.tgId) obj.tgId = user.tgId

    return obj
  }

  private genRandomCode(length: number): string {
    let code = ''
    const chars = this.cryptoService.utils.randomUUID()
    const charLength = chars.length

    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * charLength))
    }

    code = code.replace(/-/g, 'a')

    return code
  }

  private getCacheKey(userId: UUID): string {
    return `${AUTH_CODE_CACHE_KEY}${userId}`
  }
}
