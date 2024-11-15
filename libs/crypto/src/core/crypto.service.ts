import { Injectable } from '@nestjs/common'
import { HashService } from './hash/hash.service'
import { EncodingService } from './encoding/encoding.service'
import { randomBytes, randomUUID } from 'crypto'

@Injectable()
export class CryptoService {
  constructor(
    private readonly hashService: HashService,
    private readonly encodingService: EncodingService,
  ) {}

  public get hash() {
    return this.hashService
  }

  public get encoding() {
    return this.encodingService
  }

  public get utils() {
    return {
      randomUUID,
      randomBytes,
    }
  }
}
