import { Base58 } from '@libs/core'
import {
  GetBalanceDto,
  GetTxByHashDto,
  GetUserTxsDto,
  ResponseAllUserTxsDto,
  ResponseGetBalance,
  ResponseSendTokenDto,
  ResponseSendTxDto,
  ResponseTxByHashDto,
  SendTokenDto,
  SendTxByChainDto,
  SupportChains,
  Web3ResponseCreateAccountDto,
} from '../types'
import { bytesToUtf8 } from '@noble/ciphers/utils'

export abstract class Web3AbstractService {
  public abstract createAccount(): Promise<Web3ResponseCreateAccountDto>
  public abstract getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance>
  public abstract sendTx<T extends SupportChains>(
    dto: SendTxByChainDto[T],
  ): Promise<ResponseSendTxDto>
  public abstract getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto>
  public abstract getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto>
  public abstract sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto>
  public abstract createUnSignedTx<CHAIN extends SupportChains, T>(
    dto: Omit<SendTxByChainDto[CHAIN], 'privateKey'>,
  ): Promise<T>
  public abstract createSignature<T, Key extends Base58 = Base58>(
    unSignedTx: T,
    privateKey: Key,
  ): Promise<Uint8Array>
  public abstract sendRawTx<T>(raw: T, value: bigint): Promise<ResponseSendTxDto>

  public static txFromBytes(bytes: Uint8Array) {
    const string = bytesToUtf8(bytes)
    try {
      const parsed = JSON.parse(string) as Record<string, any> // parsed transaction from bytes
      return parsed
    } catch {
      throw new Error('Invalid parse transactions bytes!')
    }
  }

 }
