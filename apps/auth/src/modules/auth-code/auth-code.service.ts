import { ConfigService } from '@libs/config'
import { RepositoryService } from '@libs/repository'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { lastValueFrom } from 'rxjs'
import { Cache } from 'cache-manager'
import { ClientKafka } from '@nestjs/microservices'
import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { CryptoService } from '@lib/crypto'
import { objToString } from '@libs/core'
import { AUTH_CODE_CACHE_KEY, AUTH_CODE_EX_TIME } from '@libs/constants'
import type { UUID } from '@libs/core/types'
import { GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions'
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
    private readonly rep: RepositoryService,
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

  public async createAndSendAuthCode(userId: UUID): Promise<void> {
    const cacheKey = this.getCacheKey(userId)
    let cacheVal: string | undefined = await this.authCodeCache.get(cacheKey)

    const randomCode = this.genRandomCode(this.cfg.env.AUTH_CODE_LENGTH)
    const hashCode = await this.cryptoService.hash.lightHash(randomCode, 'base58')

    cacheVal = hashCode

    if (cacheKey) {
      await this.authCodeCache.del(cacheKey)
    }
    await this.authCodeCache.set(cacheKey, cacheVal, { ttl: AUTH_CODE_EX_TIME })

    const notificationMsg: SendAuthCodeMsg = {
      userId: userId,
      msgContext: NotificationMsgContext.AUTH_CODE,
      body: randomCode,
    }

    await lastValueFrom(
      this.notificationClient.send(NotificationMsgPattern.BASIC_SEND_NOTIFICATION, notificationMsg),
    )
  }

  public async verifyAuthCode(userId: UUID, authCode: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(userId)
    const cacheVal: string | undefined = await this.authCodeCache.get(cacheKey)

    if (!cacheVal) {
      throw new GrpcPermissionDeniedException(objToString({ userId, authCode }))
    }

    const hashFromNewCode = await this.cryptoService.hash.lightHash(authCode, 'base58')

    if (hashFromNewCode !== cacheVal) {
      throw new GrpcPermissionDeniedException(objToString({ userId, authCode }))
    }

    return true
  }

  public async repeatAuthCode(): Promise<void> {}

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
