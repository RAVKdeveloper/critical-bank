import { MongoRepoService } from '@lib/mongo-repo'
import { Injectable } from '@nestjs/common'
import { SavePrivateKeyMsg } from '@lib/kafka-types'
import { GrpcNotFoundException, GrpcPermissionDeniedException } from 'nestjs-grpc-exceptions'
import { ForbiddenError, NotFoundError } from '@libs/core'
import { CryptoService } from '@lib/crypto'
import { ConfigService } from '@libs/config'
import { ConfigModel } from '../../config/config.model'
import { GetPrivateKeyHashMsg, SignDataByPrivateKeyMsg } from '@libs/grpc-types'
import { SignatoryService } from '../signatory/signatory.service'

@Injectable()
export class PrivateKeysService {
  constructor(
    private readonly mongoRep: MongoRepoService,
    private readonly cryptoService: CryptoService,
    private readonly cfg: ConfigService<ConfigModel>,
    private readonly signatoryService: SignatoryService,
  ) {}

  public async savePrivateKey(dto: SavePrivateKeyMsg) {
    const key = this.cfg.env.DECRYPT_KEY
    const { fingerprint, privateKey } =
      await this.cryptoService.fingerprint.createFingerprintFromPrivateKey(
        dto.encryptedPrivateKey,
        key,
      )

    const existFingerprint = await this.mongoRep.privateKey.findOne({
      where: {
        remainderFingerprint: fingerprint,
      },
    })

    if (existFingerprint) {
      throw new GrpcPermissionDeniedException(
        new ForbiddenError(
          'Fingerprint has already exist is database! Fingerprint: ' + fingerprint,
        ),
      )
    }

    const saveEncryptKey = this.cfg.env.SECRET_KEY
    const encryptKey = await this.cryptoService.encrypting.encryptSync(privateKey, saveEncryptKey)

    await this.mongoRep.privateKey.create({
      privateKey: encryptKey,
      remainderFingerprint: fingerprint,
    })
  }

  public async getPrivateKeyHash(dto: GetPrivateKeyHashMsg) {
    const fingerprint = this.cryptoService.fingerprint.fingerprintFromReminderFingerprint(
      dto.remainderFingerprint,
    )

    const privateKey = await this.mongoRep.privateKey.findOne({
      where: {
        remainderFingerprint: fingerprint,
      },
    })

    if (!privateKey) {
      throw new GrpcNotFoundException(new NotFoundError('Private key not found!'))
    }

    const hash = await this.cryptoService.hash.lightHash(privateKey.privateKey, 'base58')

    return { privateKeyHash: hash }
  }

  public async signDataByPrivateKey(dto: SignDataByPrivateKeyMsg) {
    const pk = await this.getPrivateKey(dto.remainderFingerprint)
    const bytes = await this.signatoryService.signDataByPrivateKey(dto.chain, pk, dto.data)

    return { signature: bytes }
  }

  private async getPrivateKey(remainderFingerprint: string) {
    const fingerprint =
      this.cryptoService.fingerprint.fingerprintFromReminderFingerprint(remainderFingerprint)

    const privateKey = await this.mongoRep.privateKey.findOne({
      where: {
        remainderFingerprint: fingerprint,
      },
    })

    if (!privateKey) {
      throw new GrpcNotFoundException(new NotFoundError('Private key not found!'))
    }

    const key = this.cfg.env.SECRET_KEY
    const encryptedPk = await this.cryptoService.encrypting.decryptSync(privateKey.privateKey, key)

    return encryptedPk
  }
}
