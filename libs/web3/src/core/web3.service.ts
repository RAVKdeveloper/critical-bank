import { Injectable } from '@nestjs/common'
import { Web3AbstractService } from './abstract/web3.abstract'
import {
  Web3ResponseCreateAccountDto,
  GetBalanceDto,
  ResponseGetBalance,
  SupportChains,
  SendTxByChainDto,
  ResponseSendTxDto,
  GetUserTxsDto,
  ResponseAllUserTxsDto,
  GetTxByHashDto,
  ResponseTxByHashDto,
  SendTokenDto,
  ResponseSendTokenDto,
} from './types'
import { EthService, SolService, TronChainService } from './blockchains'
import { Base58, rawBytesToObject } from '@libs/core'

@Injectable()
export class Web3Service {
  public static txFromBytes(bytes: Uint8Array): Record<string, any> {
    const obj: Record<string, any> = rawBytesToObject(bytes)
    return obj
  }

  private readonly chains: Record<SupportChains, Web3AbstractService>

  constructor(eth: EthService, sol: SolService, tron: TronChainService) {
    this.chains = {
      [SupportChains.ETH]: eth,
      [SupportChains.SOL]: sol,
      [SupportChains.TRON]: tron,
      [SupportChains.BITCOIN]: eth,
      [SupportChains.TON]: eth,
    }
  }

  public async createAccount(chain: SupportChains): Promise<Web3ResponseCreateAccountDto> {
    const handler = this.chains[chain]

    return await handler.createAccount.apply(this, [])
  }

  public async getBalance(chain: SupportChains, dto: GetBalanceDto): Promise<ResponseGetBalance> {
    const handler = this.chains[chain]

    return await handler.getBalance.apply(this, [dto])
  }

  public async sendTx<T extends SupportChains>(
    chain: SupportChains,
    dto: SendTxByChainDto[T],
  ): Promise<ResponseSendTxDto> {
    const handler = this.chains[chain]

    return await handler.sendToken.apply(this, [dto])
  }

  public async getUserTxs(
    chain: SupportChains,
    dto: GetUserTxsDto,
  ): Promise<ResponseAllUserTxsDto> {
    const handler = this.chains[chain]

    return await handler.getUserTxs.apply(this, [dto])
  }

  public async getTxByHash(
    chain: SupportChains,
    dto: GetTxByHashDto,
  ): Promise<ResponseTxByHashDto> {
    const handler = this.chains[chain]

    return await handler.getTxByHash.apply(this, [dto])
  }

  public async sendToken(chain: SupportChains, dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    const handler = this.chains[chain]

    return await handler.sendToken.apply(this, [dto])
  }

  public async createUnSignedTx<T, CHAIN extends SupportChains>(
    chain: SupportChains,
    dto: Omit<SendTxByChainDto[CHAIN], 'privateKey'>,
  ): Promise<T> {
    const handler = this.chains[chain]

    return await handler.createUnSignedTx.apply(this, [dto])
  }

  public async createSignature<T, Key extends Base58 = Base58>(
    chain: SupportChains,
    unSignedTx: T,
    privateKey: Key,
  ): Promise<Uint8Array> {
    const handler = this.chains[chain]

    return await handler.createSignature.apply(this, [unSignedTx, privateKey])
  }

  public async sendRawTx<T>(
    chain: SupportChains,
    raw: T,
    value: bigint,
  ): Promise<ResponseSendTxDto> {
    const handler = this.chains[chain]

    return await handler.sendRawTx.apply(this, [raw, value])
  }
}
