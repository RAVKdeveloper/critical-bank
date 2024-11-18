import { Injectable } from '@nestjs/common'
import { HashService } from './hash/hash.service'
import { EncodingService } from './encoding/encoding.service'
import { randomBytes, randomUUID } from 'crypto'
import { EncryptingService } from './encrypting/encrypting.service'

@Injectable()
export class CryptoService {
  constructor(
    private readonly hashService: HashService,
    private readonly encodingService: EncodingService,
    private readonly encryptingService: EncryptingService,
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

  public get utils() {
    return {
      randomUUID,
      randomBytes,
    }
  }
}
