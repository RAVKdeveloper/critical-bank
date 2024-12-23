import { RepositoryService } from '@libs/repository'
import { Inject, Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common'
import { UpdateUserPasswordMsg, UserBlockAccount, UserForgotPasswordMsg } from '@lib/kafka-types'
import { ClientKafka, RpcException } from '@nestjs/microservices'
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager'
import { TokensService } from '@lib/tokens'
import { UUID } from '@libs/core'
import { PRE_AUTH_TOKEN_CACHE_KEY } from '@libs/constants'
import { CryptoService } from '@lib/crypto'

import { AuthCodeService } from '../auth-code/auth-code.service'
import { IdentificationUserError } from '../auth/auth.erros'
import {
  NOTIFICATIONS_SERVICE_NAME,
  AuthRecoveryServiceMsgBrokerSubsArr,
  SendUpdatePasswordMsg,
  NotificationMsgPattern,
} from './broker-subs'
import { UserHasAlreadyBlockedError } from './auth-recovery.erros'

@Injectable()
export class AuthRecoveryService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly rep: RepositoryService,
    private readonly authCodeService: AuthCodeService,
    private readonly tokensService: TokensService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly cryptoService: CryptoService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly notificationClient: ClientKafka,
  ) {}

  public async onModuleInit() {
    const requestPatterns = AuthRecoveryServiceMsgBrokerSubsArr
    requestPatterns.forEach(pattern => {
      this.notificationClient.subscribeToResponseOf(pattern)
    })
    await this.notificationClient.connect()
  }

  public async onApplicationShutdown() {
    await this.notificationClient.close()
  }

  public async forgotPassword(msg: UserForgotPasswordMsg) {
    if (Object.keys(msg).length !== 1) {
      throw new RpcException(new IdentificationUserError(msg).toJSON())
    }

    const user = await this.rep.user.findOne({
      where: msg,
      select: {
        id: true,
      },
    })

    if (!user) {
      throw new RpcException(new IdentificationUserError(msg).toJSON())
    }

    const preAuthToken = await this.tokensService.utils.accessToken.genAccessToken({
      data: { userId: user.id },
    })

    await this.cache.del(this.applyCacheKey(user.id))
    await this.cache.set(this.applyCacheKey(user.id), preAuthToken)

    await this.authCodeService.createAndSendAuthCode(user.id, user)

    return {
      preAuthToken,
    }
  }

  public async updatePassword(msg: UpdateUserPasswordMsg) {
    const user = await this.rep.user.findOne({
      where: { id: msg.userId },
    })

    if (!user) {
      throw new RpcException(new IdentificationUserError({ userId: msg.userId }).toJSON())
    }

    const isVerify = await this.authCodeService.verifyAuthCode(user.id, msg.verifyCode)

    if (!isVerify) {
      throw new RpcException(new IdentificationUserError({ userId: msg.userId }).toJSON())
    }

    const preAuthToken = await this.cache.get(this.applyCacheKey(user.id))

    if (!preAuthToken) {
      throw new RpcException(
        new IdentificationUserError({ preAuthToken: msg.preAuthToken }).toJSON(),
      )
    } else {
      await this.cache.del(this.applyCacheKey(user.id))

      if (preAuthToken !== msg.preAuthToken) {
        throw new RpcException(
          new IdentificationUserError({ preAuthToken: msg.preAuthToken }).toJSON(),
        )
      }
    }

    const passwordHash = await this.hashPassword(msg.newPassword, user.email)

    await this.rep.user.update({ id: user.id }, { passwordHash })

    const updatePasswordMsg: SendUpdatePasswordMsg = {
      userId: user.id,
      email: user.email,
      title: 'Update user password!',
      body: `You update password, time updated - ${new Date().toDateString()}`,
    }

    this.notificationClient.send(NotificationMsgPattern.EMAIL_SEND_NOTIFICATION, updatePasswordMsg)

    return { success: true }
  }

  public async userBlockAccount(msg: UserBlockAccount) {
    const user = await this.rep.user.findOne({
      where: { id: msg.userId },
    })

    if (!user) {
      throw new RpcException(new IdentificationUserError({ userId: msg.userId }).toJSON())
    }

    if (user.isBlocked) {
      throw new RpcException(new UserHasAlreadyBlockedError(user.id).toJSON())
    }

    await this.rep.user.update({ id: user.id }, { isBlocked: true })

    const blockAccountMsg: SendUpdatePasswordMsg = {
      userId: user.id,
      email: user.email,
      title: 'Block account!',
      body: `You blocked account ${user.email}, time blocked - ${new Date().toDateString()}, if it was not you, contact support`,
    }

    this.notificationClient.send(NotificationMsgPattern.EMAIL_SEND_NOTIFICATION, blockAccountMsg)
  }

  private async hashPassword(password: string, login: string) {
    const hashMixes = await this.cryptoService.hash.generateSaltAndPepper(password + login)
    const passwordHash = await this.cryptoService.hash.createHash(password, hashMixes)

    return passwordHash
  }

  private applyCacheKey(userId: UUID) {
    return `${PRE_AUTH_TOKEN_CACHE_KEY}${userId}`
  }
}
