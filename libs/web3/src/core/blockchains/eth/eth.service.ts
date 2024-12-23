import { Injectable } from '@nestjs/common'
import { Web3 } from 'web3'
import { generateMnemonic } from 'bip39'
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
  Web3Address,
  ResponseTxDto,
  ResponseSendTokenDto,
  SendTokenDto,
} from '../../types'
import { Web3EnvsModel } from '../../models/web3.envs.model'
import { utf8ToBytes } from '@noble/hashes/utils'
import { stringifyObjectRaw } from '@libs/core'

@Injectable()
export class EthService implements Web3AbstractService {
  private readonly ethClient: Web3

  constructor(private readonly cfg: ConfigService<Web3EnvsModel>) {
    const provider = new Web3.providers.HttpProvider(cfg.env.ETH_MAIN_URL)
    this.ethClient = new Web3(provider)
  }

  public async sendRawTx<T>(raw: T, value: bigint): Promise<ResponseSendTxDto> {
    const sendedTx = await this.ethClient.eth.sendSignedTransaction(raw as any)

    return {
      txHash: Web3.utils.bytesToHex(sendedTx.transactionHash),
      amount: new Decimal(Web3.utils.fromWei(value, 'ether')),
      addressFrom: sendedTx.from,
      addressTo: sendedTx.to,
      network: SupportChains.ETH,
    }
  }

  public async createUnSignedTx<CHAIN extends SupportChains, T>(
    dto: Omit<SendTxByChainDto[CHAIN], 'privateKey'>,
  ): Promise<T> {
    const tx = {
      from: dto.addressFrom,
      to: dto.addressTo,
      value: Web3.utils.toWei(dto.amount.toString(), 'ether'),
      gas: 21000,
      gasPrice: await this.ethClient.eth.getGasPrice(),
      nonce: BigInt(0),
    }

    const nonce = await this.ethClient.eth.getTransactionCount(dto.addressFrom)
    tx.nonce = nonce

    return tx as T
  }

  public async createSignature<T, Key extends string = string>(
    unSignedTx: T,
    privateKey: Key,
  ): Promise<Uint8Array> {
    const signTx = await this.ethClient.eth.accounts.signTransaction(unSignedTx, privateKey)
    const bytes = new Uint8Array(Buffer.from(signTx.rawTransaction))
    return bytes
  }

  public async sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    const contractWrap = new this.ethClient.eth.Contract(dto.abi, dto.tokenAddress)
    const transfer = contractWrap.methods.transfer(dto.toAddress, dto.amount.toNumber())
    const gasEstimate = await this.ethClient.eth.estimateGas({
      from: dto.addressFrom,
      to: dto.tokenAddress,
      data: transfer.encodeABI(),
    })

    const tx = {
      from: dto.addressFrom,
      to: dto.tokenAddress,
      data: transfer.encodeABI(),
      gasPrice: await this.ethClient.eth.getGasPrice(),
      nonce: BigInt(0),
      gas: gasEstimate,
    }

    const nonce = await this.ethClient.eth.getTransactionCount(dto.addressFrom)
    tx.nonce = nonce

    const signTx = await this.ethClient.eth.accounts.signTransaction(tx, dto.privateKey)
    const sendedTx = await this.ethClient.eth.sendSignedTransaction(signTx.rawTransaction)

    return {
      txHash: Web3.utils.bytesToHex(sendedTx.transactionHash),
      addressFrom: dto.addressFrom,
      addressTo: dto.toAddress,
      amount: dto.amount,
      tokenName: dto.tokenName,
      fee: new Decimal(Web3.utils.fromWei(Number(tx.gas) * Number(tx.gasPrice), 'ether')),
    }
  }

  public createAccount(): Promise<Web3ResponseCreateAccountDto> {
    return new Promise<Web3ResponseCreateAccountDto>((res, rej) => {
      try {
        const acc = this.ethClient.eth.accounts.create()
        const mnemonic = generateMnemonic()

        res({ address: acc.address, privateKey: acc.privateKey, mnemonic })
      } catch (e) {
        rej(e)
      }
    })
  }

  public async getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance> {
    const balance = await this.ethClient.eth.getBalance(dto.address)

    return { balance: new Decimal(Web3.utils.fromWei(balance, 'ether').toString()) }
  }

  public async sendTx<T extends SupportChains>(
    dto: SendTxByChainDto[T],
  ): Promise<ResponseSendTxDto> {
    const tx = {
      from: dto.addressFrom,
      to: dto.addressTo,
      value: Web3.utils.toWei(dto.amount.toString(), 'ether'),
      gas: 21000,
      gasPrice: await this.ethClient.eth.getGasPrice(),
      nonce: BigInt(0),
    }

    const nonce = await this.ethClient.eth.getTransactionCount(dto.addressFrom)
    tx.nonce = nonce
    const signTx = await this.ethClient.eth.accounts.signTransaction(tx, dto.privateKey)
    const sendedTx = await this.ethClient.eth.sendSignedTransaction(signTx.rawTransaction)

    return {
      txHash: Web3.utils.bytesToHex(sendedTx.transactionHash),
      amount: new Decimal(Web3.utils.fromWei(tx.value, 'ether')),
      addressFrom: sendedTx.from,
      addressTo: sendedTx.to,
      network: SupportChains.ETH,
    }
  }

  public async getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto> {
    return await this.getTransactionsByAccount(dto.address)
  }

  public async getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto> {
    const tx = await this.ethClient.eth.getTransaction(Web3.utils.hexToBytes(dto.txHash))

    return {
      txHash: tx.hash,
      addressFrom: tx.from,
      addressTo: tx.to,
      amount: new Decimal(Web3.utils.fromWei(tx.value, 'ether')),
      data: tx.data,
      fee: new Decimal(Web3.utils.fromWei(Number(tx.gas) * Number(tx.gasPrice), 'ether')),
      blockNumber: BigInt(tx.blockNumber),
    }
  }

  private async getTransactionsByAccount(address: Web3Address) {
    const txs: ResponseTxDto[] = []
    const endBlockNumber: bigint = await this.ethClient.eth.getBlockNumber()
    const startBlockNumber = endBlockNumber - BigInt(1000)

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
      const block = await this.ethClient.eth.getBlock(i, true)
      if (block != null && block.transactions != null) {
        block.transactions.forEach((tx: any) => {
          if ([tx.from, tx.to].includes(address)) {
            const txToFormat: ResponseTxDto = {
              txHash: tx.hash,
              addressFrom: tx.from,
              addressTo: tx.to,
              amount: new Decimal(Web3.utils.fromWei(tx.value, 'ether')),
              timestamp: 0,
              network: SupportChains.ETH,
              fee: new Decimal(Web3.utils.fromWei(Number(tx.gas) * Number(tx.gasPrice), 'ether')),
            }

            txs.push(txToFormat)
          }
        })
      }
    }

    return txs
  }
}
