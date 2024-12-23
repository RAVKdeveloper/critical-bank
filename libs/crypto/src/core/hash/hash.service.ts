import { createHash } from 'node:crypto'
import { HashEncoding, ReturnSaltAndPepper } from '@lib/crypto/types/common'
import { Injectable } from '@nestjs/common'
import { keccak_256 as keccak256 } from '@noble/hashes/sha3'
import * as bcrypt from 'bcrypt'
import { EncodingService } from '../encoding/encoding.service'
import { Base58 } from '@libs/core/types/common'

@Injectable()
export class HashService {
  private hashFn: (data: unknown) => Uint8Array

  constructor(private readonly encodingService: EncodingService) {
    this.hashFn = keccak256
  }

  public set setHashAlgorithm(hashFn: (data: unknown) => Uint8Array) {
    this.hashFn = hashFn
  }

  // Hashed not sold and pepper and only keccak256 algorithm
  public async lightHash(data: any, encoding: HashEncoding = 'base58', rounds: number = 0) {
    if (rounds > 0) {
      let currentHash = data
      for (let i = 1; i <= rounds; i++) {
        currentHash = this.lightHash(currentHash)
      }
      return currentHash
    }

    const bytesFromMsg = this.serializeToRaw(data)
    const keccakHash = this.hashFn(bytesFromMsg)
    return this.encodingService.encoding(keccakHash, encoding)
  }

  public generateSaltAndPepper(userData: any): Promise<ReturnSaltAndPepper> {
    return new Promise<ReturnSaltAndPepper>((res, rej) => {
      try {
        userData = this.serializeToRaw(userData)
        const hash = createHash('sha256')
        hash.update(userData)
        const hashResult = hash.digest('hex')

        const salt = hashResult.substring(0, 16)
        const pepper = hashResult.substring(16)

        res({ salt, pepper })
      } catch (e) {
        rej(e)
      }
    })
  }

  public async createHash(
    data: any,
    mixes: ReturnSaltAndPepper,
    encoding: HashEncoding = 'base58',
    onlyKeccak = false,
    onlyBcryptFormat = true,
  ) {
    const bytesFromMsg = this.serializeToRaw(data)
    const salt = Uint8Array.from(Buffer.from(mixes.salt))
    const pepper = Uint8Array.from(Buffer.from(mixes.pepper))
    const dataToHash = Uint8Array.from(Buffer.concat([bytesFromMsg, salt, pepper]))
    const keccakHash = this.hashFn(dataToHash)

    if (onlyKeccak) {
      return this.encodingService.encoding(keccakHash, encoding)
    }

    const encodingKeccakHash = this.encodingService.encoding(keccakHash, encoding)
    const finalHash = await bcrypt.hash(encodingKeccakHash, 12)

    return onlyBcryptFormat
      ? finalHash
      : this.encodingService.encoding(Uint8Array.from(Buffer.from(finalHash)), encoding)
  }

  public async verifyHash(
    data: any,
    hash: string,
    mixes: ReturnSaltAndPepper,
    hashFormat: HashEncoding = 'base58',
  ): Promise<boolean> {
    const newHash = await this.createHash(data, mixes, hashFormat, true)

    const isValidHash = await bcrypt.compare(newHash, hash)

    return isValidHash
  }

  private serializeToRaw(data: any): Uint8Array {
    let serializeData: Buffer

    if (typeof data === 'object') {
      serializeData = Buffer.from(JSON.stringify(data))
    } else {
      serializeData = Buffer.from(data)
    }

    Uint8Array.from(serializeData)

    return Uint8Array.from(serializeData)
  }
}
