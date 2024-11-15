import crypto from 'node:crypto'
import { HashEncoding, ReturnSaltAndPepper } from '@lib/crypto/types/common'
import { Injectable } from '@nestjs/common'
import { keccak_256 as keccak256 } from '@noble/hashes/sha3'
import bcrypt from 'bcrypt'
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
  public async lightHash(data: any, encoding: HashEncoding = 'base58') {
    const bytesFromMsg = this.serializeToRaw(data)
    const keccakHash = this.hashFn(bytesFromMsg)
    return this.encodingService.encoding(keccakHash, encoding)
  }

  public generateSaltAndPepper(userData: any): Promise<ReturnSaltAndPepper> {
    return new Promise<ReturnSaltAndPepper>((res, rej) => {
      try {
        userData = this.serializeToRaw(userData)
        const hash = crypto.createHash('sha256')
        hash.update(userData)
        const hashResult = hash.digest('hex')

        const salt = hashResult.substring(0, 16)
        const pepper = hashResult.substring(16)

        return { salt, pepper }
      } catch (e) {
        throw e
      }
    })
  }

  public async createHash(
    data: any,
    mixes: ReturnSaltAndPepper,
    encoding: HashEncoding = 'base58',
    onlyKeccak = false,
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

    return this.encodingService.encoding(Uint8Array.from(Buffer.from(finalHash)), encoding)
  }

  public async verifyHash(
    data: any,
    hash: string,
    hashFormat: HashEncoding = 'base58',
  ): Promise<boolean> {
    const mixes = await this.generateSaltAndPepper(data)
    const newHash = await this.createHash(data, mixes, hashFormat, true)
    const base64Hash = this.decodingBs58ToBs64(hash)

    const isValidHash = await bcrypt.compare(newHash, base64Hash)

    return isValidHash
  }

  private decodingBs58ToBs64(data: Base58, encoding: HashEncoding = 'base58') {
    return this.encodingService.encoding(this.encodingService.decoding(data, encoding), 'base64')
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
