import { xchacha20poly1305 } from '@noble/ciphers/chacha'
import { concatBytes, numberToBytesBE } from '@noble/ciphers/utils'
import { Injectable } from '@nestjs/common'
import { HashEncoding } from '@lib/crypto/types/common'
import { EncodingService } from '../encoding/encoding.service'
import { randomBytes } from '@noble/hashes/utils'

@Injectable()
export class EncryptingService {
  private readonly basicNonce = numberToBytesBE(1667678672008, 24)
  private readonly defaultBytesIvLength = 32

  constructor(private readonly encodingService: EncodingService) {}

  public encryptSync(
    data: any,
    key: string,
    decodeDataFormat: HashEncoding = 'utf-8',
    keyFormat: HashEncoding = 'base64',
  ) {
    return new Promise<string>((res, rej) => {
      try {
        const keyToCipher = this.encodingService.decoding(key, keyFormat)
        if (typeof data === 'object') {
          data = JSON.stringify(data)
        }

        const dataToEncrypt = this.encodingService.decoding(data, decodeDataFormat)
        const chacha = xchacha20poly1305(keyToCipher, this.basicNonce)
        const encryptBytes = chacha.encrypt(dataToEncrypt)
        const encryptTextToBs64 = this.encodingService.encoding(encryptBytes, 'base64')

        res(encryptTextToBs64)
      } catch (e) {
        rej(e)
      }
    })
  }

  public async decryptSync(
    data: string,
    key: string,
    keyFormat: HashEncoding = 'base64',
    encodeFormat: HashEncoding = 'utf-8',
  ) {
    return new Promise<string>((res, rej) => {
      try {
        const keyToCipher = this.encodingService.decoding(key, keyFormat)
        const dataToEncrypt = this.encodingService.decoding(data, 'base64')
        const chacha = xchacha20poly1305(keyToCipher, this.basicNonce)
        const decryptBytes = chacha.decrypt(dataToEncrypt)
        const encryptText = this.encodingService.encoding(decryptBytes, encodeFormat)

        res(encryptText)
      } catch (e) {
        rej(e)
      }
    })
  }

  public encryptSyncWithIv(
    data: any,
    key: string,
    keyFormat: HashEncoding = 'base64',
  ): Promise<Uint8Array> {
    return new Promise<Uint8Array>((res, rej) => {
      try {
        const iv = randomBytes(this.defaultBytesIvLength)
        const keyToCipher = this.encodingService.decoding(key, keyFormat)

        if (typeof data === 'object' && !(data instanceof Uint8Array)) {
          data = JSON.stringify(data)
        }

        const cipher = xchacha20poly1305(keyToCipher, this.basicNonce, iv)
        const dataToEncrypt = new Uint8Array(Buffer.from(data))
        const encryptBytes = cipher.encrypt(dataToEncrypt)
        const concatBytesWithIv = concatBytes(iv, encryptBytes)

        res(concatBytesWithIv)
      } catch (e) {
        rej(e)
      }
    })
  }

  public decryptSyncWithIv(
    data: any,
    key: string,
    keyFormat: HashEncoding = 'base64',
    encodeDataFormat: HashEncoding = 'utf-8',
  ) {
    return new Promise<string>((res, rej) => {
      try {
        const keyToCipher = this.encodingService.decoding(key, keyFormat)

        if (typeof data === 'object' && !(data instanceof Uint8Array)) {
          data = JSON.stringify(data)
        }

        const dataToEncrypt = new Uint8Array(Buffer.from(data))

        if (dataToEncrypt.length < 32) {
          throw new Error('Invalid data bytes length!')
        }

        const iv = dataToEncrypt.slice(32)
        const chacha = xchacha20poly1305(keyToCipher, this.basicNonce, iv)
        const decryptBytes = chacha.decrypt(dataToEncrypt.slice(32, dataToEncrypt.length))
        const decryptText = this.encodingService.encoding(decryptBytes, encodeDataFormat)

        res(decryptText)
      } catch (e) {
        rej(e)
      }
    })
  }
}
