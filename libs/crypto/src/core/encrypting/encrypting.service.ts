import { xchacha20poly1305 } from '@noble/ciphers/chacha'
import { bytesToNumberBE, numberToBytesBE } from '@noble/ciphers/utils'
import { Injectable } from '@nestjs/common'
import { HashEncoding } from '@lib/crypto/types/common'
import { EncodingService } from '../encoding/encoding.service'

@Injectable()
export class EncryptingService {
  private readonly basicNonce = numberToBytesBE(162008, 7)

  constructor(private readonly encodingService: EncodingService) {}

  public encryptSync(
    data: any,
    key: string,
    decodeDataFormat: HashEncoding = 'utf-8',
    keyFormat: HashEncoding = 'base58',
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
    keyFormat: HashEncoding = 'base58',
    encodeFormat: HashEncoding = 'utf-8',
  ) {
    return new Promise<string>((res, rej) => {
      try {
        const keyToCipher = this.encodingService.decoding(key, keyFormat)
        const dataToEncrypt = this.encodingService.decoding(data, 'base64')
        const chacha = xchacha20poly1305(keyToCipher, this.basicNonce)
        const decryptBytes = chacha.decrypt(dataToEncrypt)
        const encryptTextToBs64 = this.encodingService.encoding(decryptBytes, encodeFormat)

        res(encryptTextToBs64)
      } catch (e) {
        rej(e)
      }
    })
  }
}
