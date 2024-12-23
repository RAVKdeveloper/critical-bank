import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { CryptoService } from '../crypto.service'
import { Base58, Base64 } from '@libs/core'
import { concatBytes } from '@noble/hashes/utils'

@Injectable()
export class FingerprintService {
  constructor(
    @Inject(forwardRef(() => CryptoService)) private readonly cryptoService: CryptoService,
  ) {}

  public async createFingerprintFromPrivateKey(
    privateKey: Uint8Array,
    key: string,
    defaultRounds = 100,
  ) {
    const pkBase58 = (await this.cryptoService.encrypting.decryptSyncWithIv(
      privateKey,
      key,
      'base64',
      'base58',
    )) as Base58
    const hashFromPk: Base58 = await this.cryptoService.hash.lightHash(
      pkBase58,
      'base58',
      defaultRounds,
    )

    const fingerprint = await this.calcFingerprintFromHash(hashFromPk)

    return { fingerprint, privateKey: pkBase58 }
  }

  public reminderFingerprint(fingerprint: Base58): Base64 {
    const bytes = this.cryptoService.encoding.decoding(fingerprint, 'base58')
    const reversedBytes = bytes.reverse()
    return this.cryptoService.encoding.encoding(reversedBytes, 'base64') as Base64
  }

  public fingerprintFromReminderFingerprint(reminderFingerprint: Base64): Base58 {
    const bytes = this.cryptoService.encoding.decoding(reminderFingerprint, 'base64')
    const reversedBytes = bytes.reverse()
    return this.cryptoService.encoding.encoding(reversedBytes, 'base58') as Base58
  }

  private async calcFingerprintFromHash(pkHash: Base58): Promise<Base58> {
    const bytes = new Uint8Array(this.cryptoService.encoding.decoding(pkHash, 'base58')).slice(-20)
    const hashOne = this.cryptoService.encoding.decoding(
      await this.cryptoService.hash.lightHash(bytes.slice(0, 10), 'base58'),
      'base58',
    )
    const hashTwo = this.cryptoService.encoding.decoding(
      await this.cryptoService.hash.lightHash(bytes.slice(10, 20), 'base58'),
      'base58',
    )

    const concatHashBytes = concatBytes(hashOne, hashTwo)
    const finalHash = await this.cryptoService.hash.lightHash(concatHashBytes, 'base58')

    return finalHash
  }
}
