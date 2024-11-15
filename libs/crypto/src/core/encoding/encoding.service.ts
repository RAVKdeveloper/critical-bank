import { HashEncoding, OtherLibEncoding } from '@lib/crypto/types/common'
import { Injectable } from '@nestjs/common'
import bs58 from 'bs58'

@Injectable()
export class EncodingService {
  private readonly libFormats: Record<OtherLibEncoding, Function[]> = {
    base58: [bs58.encode, bs58.decode],
  }

  public encoding<T extends string>(data: Uint8Array, format: HashEncoding): T {
    if (this.libFormats[format]) {
      const callEnc: Function = this.libFormats[format][0]

      return callEnc.apply(this, [data])
    }

    return Buffer.from(data).toString(format as any) as T
  }

  public decoding<T extends string>(data: T, format: HashEncoding): Uint8Array {
    if (this.libFormats[format]) {
      const callEnc: Function = this.libFormats[format][1]

      return callEnc.apply(this, [data])
    }

    const buffer = Buffer.from(data, format as any)

    return Uint8Array.from(buffer)
  }
}
