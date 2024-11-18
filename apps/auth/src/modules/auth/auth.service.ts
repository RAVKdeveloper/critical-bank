import { Inject, Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common'
import {
  GrpcNotFoundException,
  GrpcInvalidArgumentException,
  GrpcPermissionDeniedException,
} from 'nestjs-grpc-exceptions'
import { omit } from 'ramda'

import { RepositoryService, UserEntity } from '@libs/repository'
import { NotFoundUserError, UUID, UserIsBlockedError, getNow, objToString } from '@libs/core'
import { CustomLogger } from '@lib/logger'
import { CryptoService } from '@lib/crypto'
import type { LoginMsg, RegistrationMsg, VerifyAuthCodeMsg } from '@libs/grpc-types'
import { TokensService } from '@lib/tokens'
import { ClientKafka, RpcException } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import { RepeatVerifyCodeMsg } from '@lib/kafka-types'

import { AuthIdentifierObj, RegistrationCreatedData } from './types/auth.types'
import { AuthCodeService } from '../auth-code/auth-code.service'
import { IdentificationUserError, UserHasAlreadyExistError } from './auth.erros'
import {
  AuthServiceMsgBrokerSubsArr,
  NOTIFICATIONS_SERVICE_NAME,
  NotificationMsgContext,
  NotificationMsgPattern,
  SendSuccessfulAuthNotificationMsg,
} from './broker-subs'

@Injectable()
export class AuthService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly rep: RepositoryService,
    private readonly logger: CustomLogger,
    private readonly cryptoService: CryptoService,
    private readonly authCodeService: AuthCodeService,
    private readonly tokensService: TokensService,
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

  public async me(userId: UUID) {
    const user = await this.rep.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new RpcException(objToString({ userId }))
    }

    return { user, timestamp: Date.now() }
  }

  public async registration(msg: RegistrationMsg) {
    const identifierObj = await this.checkRegistrationCredentials(msg)
    const executedLoginString = msg.email
    const passwordHash = await this.hashPassword(msg.password, executedLoginString)

    const { password, tgId, email, phoneNumber, ...dataFromMsg } = msg
    const createdData: RegistrationCreatedData = {
      ...identifierObj,
      ...dataFromMsg,
      passwordHash,
    }

    const { passwordHash: createdPassHash, ...newUser } = await this.rep.user.save({
      ...createdData,
    })

    await this.authCodeService.createAndSendAuthCode(newUser.id as UUID, newUser as UserEntity)

    this.logger.info(`Create new user! UUID ${newUser.id}`)

    return { user: newUser as UserEntity, timestamp: getNow() }
  }

  public async login(msg: LoginMsg) {
    const loginCredentials = omit(['password'], msg)

    if (Object.keys(loginCredentials).length !== 1) {
      throw new RpcException(new IdentificationUserError(loginCredentials).toJSON())
    }

    const user = await this.rep.user.findOne({
      where: loginCredentials,
    })

    if (!user) {
      throw new RpcException(new IdentificationUserError(loginCredentials).toJSON())
    }

    const executedLoginString = user.email
    const isValidPass = await this.verifyPassword(
      msg.password,
      user.passwordHash,
      executedLoginString,
    )

    if (!isValidPass) {
      throw new RpcException(new IdentificationUserError(loginCredentials).toJSON())
    }

    await this.authCodeService.createAndSendAuthCode(user.id as UUID, user)

    return { user, timestamp: getNow() }
  }

  public async verifyUserLoginAuthCode(msg: VerifyAuthCodeMsg) {
    const isVerify = await this.authCodeService.verifyAuthCode(msg.userId as UUID, msg.authCode)

    if (!isVerify) {
      throw new RpcException(objToString({ userId: msg.userId, authCode: msg.authCode }))
    }

    const user = await this.rep.user.findOne({
      where: { id: msg.userId },
      select: {
        id: true,
        isVerify: true,
        isBlocked: true,
      },
    })

    if (!user) {
      throw new RpcException(new NotFoundUserError(user.id).toJSON())
    }

    if (user.isBlocked) {
      throw new RpcException(new UserIsBlockedError(user.id).toJSON())
    }

    if (!user.isVerify) {
      await this.rep.user.update({ id: user.id }, { isVerify: true })

      if (user.email) {
        const msgToSendSuccessfulAuthNotification: SendSuccessfulAuthNotificationMsg = {
          userId: user.id,
          msgContext: NotificationMsgContext.REGISTERED,
          email: user.email,
        }

        await lastValueFrom(
          this.notificationClient.send(
            NotificationMsgPattern.BASIC_SEND_NOTIFICATION,
            msgToSendSuccessfulAuthNotification,
          ),
        )
      }
    } else {
      const msgToSendSuccessfulAuthNotification: SendSuccessfulAuthNotificationMsg = {
        userId: user.id,
        msgContext: NotificationMsgContext.LOGIN,
        email: user.email ?? undefined,
      }

      await lastValueFrom(
        this.notificationClient.send(
          NotificationMsgPattern.BASIC_SEND_NOTIFICATION,
          msgToSendSuccessfulAuthNotification,
        ),
      )
    }

    const tokens = await this.tokensService.genTokensPair({ data: user.id })

    return { userId: user.id, ...tokens }
  }

  public async repeatAuthCode(msg: RepeatVerifyCodeMsg) {
    const user = await this.rep.user.findOne({
      where: { id: msg.userId },
      select: {
        id: true,
        email: true,
        tgId: true,
      },
    })

    if (!user) {
      throw new RpcException(new IdentificationUserError(msg).toJSON())
    }

    await this.authCodeService.createAndSendAuthCode(msg.userId, user)
  }

  private async checkRegistrationCredentials(msg: RegistrationMsg) {
    let identifierObj: AuthIdentifierObj = {}

    if (msg.email) identifierObj.email = msg.email

    if (msg.phoneNumber) identifierObj.phoneNumber = msg.phoneNumber

    if (msg.tgId) identifierObj.tgId = msg.tgId

    const objLength = Object.values(identifierObj).length

    if (objLength <= 0 || objLength > 1) {
      throw new RpcException(new IdentificationUserError(identifierObj).toJSON())
    }

    const existUser = await this.rep.user.findOne({
      where: identifierObj,
    })

    if (existUser) {
      throw new RpcException(new UserHasAlreadyExistError(identifierObj).toJSON())
    }

    return identifierObj
  }

  private async hashPassword(password: string, login: string) {
    const hashMixes = await this.cryptoService.hash.generateSaltAndPepper(password + login)
    const passwordHash = await this.cryptoService.hash.createHash(password, hashMixes)

    return passwordHash
  }

  private async verifyPassword(
    password: string,
    hashPassword: string,
    login: string,
  ): Promise<boolean> {
    const hashMixes = await this.cryptoService.hash.generateSaltAndPepper(password + login)
    return await this.cryptoService.hash.verifyHash(password, hashPassword, hashMixes)
  }
}
