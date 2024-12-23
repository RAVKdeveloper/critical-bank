import { Injectable } from '@nestjs/common'
import { HashService } from './hash/hash.service'
import { EncodingService } from './encoding/encoding.service'
import { randomBytes, randomUUID } from 'crypto'
import { EncryptingService } from './encrypting/encrypting.service'
import { FingerprintService } from './fingerprint/fingerprint.service'

@Injectable()
export class CryptoService {
  constructor(
    private readonly hashService: HashService,
    private readonly encodingService: EncodingService,
    private readonly encryptingService: EncryptingService,
    private readonly fingerprintService: FingerprintService,
  ) {}

  public get hash() {
    return this.hashService
  }

  public get encoding() {
    return this.encodingService
  }

  public get encrypting() {
    return this.encryptingService
  }

  public get fingerprint() {
    return this.fingerprintService
  }

  public get utils() {
    return {
      randomUUID,
      randomBytes,
    }
  }
}
