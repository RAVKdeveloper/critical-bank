import { Injectable } from '@nestjs/common'
import { TronWeb } from 'tronweb'
import { Decimal } from 'decimal.js'

import { ConfigService } from '@libs/config'

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
  ResponseSendTokenDto,
  SendTokenDto,
} from '../../types'
import { Web3EnvsModel } from '../../models/web3.envs.model'

@Injectable()
export class TronChainService implements Web3AbstractService {
  private readonly tronClient: TronWeb

  constructor(private readonly cfg: ConfigService<Web3EnvsModel>) {
    this.tronClient = new TronWeb({
      fullNode: cfg.env.TON_MAIN_URL,
      solidityNode: cfg.env.TON_MAIN_URL,
      eventServer: cfg.env.TON_MAIN_URL,
    })
  }

  public createUnSignedTx<CHAIN extends SupportChains, T>(dto: Omit<SendTxByChainDto[CHAIN], 'privateKey'>): Promise<T> {
    throw new Error('Method not implemented.')
  }

  public createSignature<T, Key extends string = string>(unSignedTx: T, privateKey: Key): Promise<Uint8Array> {
    throw new Error('Method not implemented.')
  }
  
  public sendRawTx<T>(raw: T, value: bigint): Promise<ResponseSendTxDto> {
    throw new Error('Method not implemented.')
  }

  public async sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    const options = {
      feeLimit: 10000000,
      callValue: 0,
    }

    const tx = await this.tronClient.transactionBuilder.triggerSmartContract(
      this.tronClient.address.toHex(dto.tokenAddress),
      'transfer(address,uint256)',
      options,
      [
        {
          type: 'address',
          value: dto.toAddress,
        },
        {
          type: 'uint256',
          value: dto.amount.toNumber(),
        },
      ],
      this.tronClient.address.toHex(dto.addressFrom),
    )

    const signedTx = await this.tronClient.trx.sign(tx.transaction, dto.privateKey)
    const sendedTx = await this.tronClient.trx.sendRawTransaction(signedTx)

    return {
      addressFrom: dto.addressFrom,
      addressTo: dto.toAddress,
      tokenName: dto.tokenName,
      amount: dto.amount,
      txHash: sendedTx.transaction.txID,
      fee: new Decimal(options.feeLimit),
    }
  }

  public async createAccount(): Promise<Web3ResponseCreateAccountDto> {
    const newAccount = await this.tronClient.createAccount()
    const mnemonic = this.tronClient.createRandom()

    return {
      privateKey: newAccount.privateKey,
      address: newAccount.address.base58,
      mnemonic: mnemonic.mnemonic.phrase,
    }
  }

  public async getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance> {
    const balance = await this.tronClient.trx.getBalance(dto.address)

    return { balance: new Decimal(balance) }
  }

  public async sendTx(dto: SendTxByChainDto['TRON']): Promise<ResponseSendTxDto> {
    const data = await this.tronClient.trx.sendTransaction(dto.addressTo, dto.amount.toNumber(), {
      privateKey: dto.privateKey,
    })

    return {
      txHash: data.transaction.txID,
      addressFrom: dto.addressFrom,
      addressTo: dto.addressTo,
      amount: dto.amount,
      network: SupportChains.TRON,
    }
  }

  public async getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto> {
    const txsFrom = await this.tronClient.trx.getTransactionsFromAddress(
      dto.address,
      dto.limit,
      dto.offset,
    )
    const txsTo = await this.tronClient.trx.getTransactionsToAddress(
      dto.address,
      dto.limit,
      dto.offset,
    )

    const computedTxs: ResponseAllUserTxsDto = [...txsFrom, ...txsTo]
      .sort((tx, tx2) => tx.raw_data.timestamp - tx2.raw_data.timestamp)
      .map(tx => ({
        addressFrom: tx.raw_data.contract[0].parameter.value.owner_address,
        amount: new Decimal(0),
        addressTo: 'd',
        fee: new Decimal(2343),
        txHash: tx.txID,
        timestamp: tx.raw_data.timestamp,
        network: SupportChains.TRON,
      }))

    return computedTxs
  }

  public async getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto> {
    throw new Error('Method not implemented!')
  }
}
