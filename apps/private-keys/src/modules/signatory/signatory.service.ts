import { Web3Service } from '@lib/web3'
import { SupportChains } from '@lib/web3/core/types'
import { rawBytesToObject } from '@libs/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SignatoryService {
  constructor(private readonly web3Service: Web3Service) {}

  public async signDataByPrivateKey(
    chain: SupportChains,
    privateKey: string,
    data: Uint8Array,
  ): Promise<Uint8Array> {
    const unSignedTx = rawBytesToObject(data)

    const signedData = await this.web3Service.createSignature(chain, unSignedTx, privateKey)

    return signedData
  }
}
