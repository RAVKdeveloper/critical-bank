import { ConfigService } from '@libs/config'
import { Injectable } from '@nestjs/common'
import * as bitcoin from 'bitcoinjs-lib'

import { Web3EnvsModel } from '../../models/web3.envs.model'
import { Web3AbstractService } from '../../abstract/web3.abstract'
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
} from '../../types'

@Injectable()
export class BitcoinService implements Web3AbstractService {
  constructor(private readonly cfg: ConfigService<Web3EnvsModel>) {}

  public createAccount(): Promise<Web3ResponseCreateAccountDto> {
    throw new Error('Method not implemented.')
  }

  public getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance> {
    throw new Error('Method not implemented.')
  }

  public sendTx<T extends SupportChains>(dto: SendTxByChainDto[T]): Promise<ResponseSendTxDto> {
    throw new Error('Method not implemented.')
  }

  public getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto> {
    throw new Error('Method not implemented.')
  }

  public getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto> {
    throw new Error('Method not implemented.')
  }

  public sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    throw new Error('Method not implemented. This bitcoin wallet')
  }
}
