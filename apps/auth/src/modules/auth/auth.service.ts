import { Injectable } from '@nestjs/common'
import {
  GrpcNotFoundException,
  GrpcInvalidArgumentException,
  GrpcPermissionDeniedException,
} from 'nestjs-grpc-exceptions'

import { RepositoryService } from '@libs/repository'
import { UUID, getNow, objToString } from '@libs/core'
import { CustomLogger } from '@lib/logger'
import { CryptoService } from '@lib/crypto'
import type { RegistrationMsg } from '@libs/grpc-types'

import { AuthIdentifierObj, RegistrationCreatedData } from './types/auth.types'
import { AuthCodeService } from '../auth-code/auth-code.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly rep: RepositoryService,
    private readonly logger: CustomLogger,
    private readonly cryptoService: CryptoService,
    private readonly authCodeService: AuthCodeService,
  ) {}

  public async me(userId: UUID) {
    const user = await this.rep.user.findOne({
      where: {
        id: userId,
      },
    })

    if (!user) {
      throw new GrpcNotFoundException(objToString({ userId }))
    }

    return { user, timestamp: Date.now() }
  }

  public async registration(msg: RegistrationMsg) {
    const identifierObj = await this.checkRegistrationCredentials(msg)
    const executedLoginString = String(Object.values(identifierObj)[0])
    const passwordHash = await this.hashPassword(msg.password, executedLoginString)

    const createdData: RegistrationCreatedData = {
      ...identifierObj,
      ...msg,
      passwordHash,
    }

    const newUser = await this.rep.user.save({
      ...createdData,
    })

    await this.authCodeService.createAndSendAuthCode(newUser.id as UUID)

    return { user: newUser, timestamp: getNow() }
  }

  private async checkRegistrationCredentials(msg: RegistrationMsg) {
    let identifierObj: AuthIdentifierObj = {}

    if (msg.email) identifierObj.email = msg.email

    if (msg.phoneNumber) identifierObj.phoneNumber = msg.phoneNumber

    if (msg.tgId) identifierObj.tgId = msg.tgId

    const objLength = Object.values(identifierObj).length

    if (objLength <= 0 || objLength > 1) {
      throw new GrpcInvalidArgumentException(
        objToString({ error: 'Invalid identification props', indetifierObj: identifierObj }),
      )
    }

    const existUser = await this.rep.user.findOne({
      where: identifierObj,
    })

    if (existUser) {
      throw new GrpcPermissionDeniedException(
        objToString({ error: 'User has already exist', indetifierObj: identifierObj }),
      )
    }

    return identifierObj
  }

  private async hashPassword(password: string, login: string) {
    const hashMixes = await this.cryptoService.hash.generateSaltAndPepper(password + login)
    const passwordHash = await this.cryptoService.hash.createHash(password, hashMixes)

    return passwordHash
  }
}
