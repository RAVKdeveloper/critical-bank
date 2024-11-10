import { Injectable, Inject } from '@nestjs/common'
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  GrpcNotFoundException,
  GrpcInvalidArgumentException,
  GrpcPermissionDeniedException,
} from 'nestjs-grpc-exceptions'

import { RepositoryService } from '@libs/repository'
import { objToString } from '@libs/core'
import { CustomLogger } from '@lib/logger'

import type { RegistrationMsg } from '@libs/grpc-types'

@Injectable()
export class AuthService {
  private readonly authCodeCacheKey = 'auth-code-'

  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly rep: RepositoryService,
    private readonly logger: CustomLogger,
  ) {}

  public async me(userId: string) {
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
    await this.checkRegistrationCredentials(msg)
  }

  private async checkRegistrationCredentials(msg: RegistrationMsg) {
    let indetifierObj: Record<string, string | number> = {}

    if (msg.email) indetifierObj.email = msg.email

    if (msg.phoneNumber) indetifierObj.phoneNumber = msg.phoneNumber

    if (msg.tgId) indetifierObj.tgId = msg.tgId

    const objLength = Object.values(indetifierObj).length

    if (objLength <= 0 || objLength > 1) {
      throw new GrpcInvalidArgumentException(
        objToString({ error: 'Invalid indetification props', indetifierObj }),
      )
    }

    const existUser = await this.rep.user.findOne({
      where: indetifierObj,
    })

    if (existUser) {
      throw new GrpcPermissionDeniedException(
        objToString({ error: 'User has already exist', indetifierObj }),
      )
    }

    return true
  }
}
