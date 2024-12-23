import { Injectable } from '@nestjs/common'
import { ConfigService } from '@libs/config'
import * as SolanaWeb3 from '@solana/web3.js'
import { generateMnemonic } from 'bip39'
import { Decimal } from 'decimal.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

import { CryptoService } from '@lib/crypto'

import { Web3AbstractService } from '../../abstract/web3.abstract'
import { Web3EnvsModel } from '../../models/web3.envs.model'
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
  ResponseTxDto,
} from '../../types'

@Injectable()
export class SolService implements Web3AbstractService {
  private readonly client: typeof SolanaWeb3 = SolanaWeb3
  private readonly connection: SolanaWeb3.Connection

  constructor(
    private readonly cfg: ConfigService<Web3EnvsModel>,
    private readonly cryptoService: CryptoService,
  ) {
    this.connection = new SolanaWeb3.Connection(this.cfg.env.SOL_MAIN_URL, 'confirmed')
  }

  public async createUnSignedTx<CHAIN extends SupportChains, T>(dto: Omit<SendTxByChainDto[CHAIN], 'privateKey'>): Promise<T> {
    const payerPubKey = new this.client.PublicKey(dto.addressFrom)
    const recipientPubKey = new this.client.PublicKey(dto.addressTo)

    const transferTx = this.client.SystemProgram.transfer({
      fromPubkey: payerPubKey,
      toPubkey: recipientPubKey,
      lamports: dto.amount.toNumber() * this.client.LAMPORTS_PER_SOL,
    })

    return transferTx as T
  }

  public async createSignature<T, Key extends string = string>(unSignedTx: T, privateKey: Key): Promise<Uint8Array> {
    const transaction = new this.client.Transaction().add(unSignedTx as any)
    const payer = this.client.Keypair.fromSecretKey(this.cryptoService.encoding.decoding(privateKey, 'base58'),)

    transaction.sign(payer)

    const serializedTx = new Uint8Array(transaction.serialize())

    return serializedTx
  }

  public async sendRawTx<T>(raw: T, value: bigint): Promise<ResponseSendTxDto> {

    if(!(raw instanceof Uint8Array) || !(raw instanceof Buffer)) {
      raw = Buffer.from(JSON.stringify(raw)) as T
    }

    const signature = await this.connection.sendRawTransaction(raw as Uint8Array)

    return {
      addressFrom: '',
      addressTo: '',
      amount: new Decimal(value.toString()),
      txHash: signature,
      network: SupportChains.SOL,
    }
  }

  public createAccount(): Promise<Web3ResponseCreateAccountDto> {
    return new Promise<Web3ResponseCreateAccountDto>((res, rej) => {
      try {
        const keyPair = this.client.Keypair.generate()
        const address = keyPair.publicKey.toBase58()
        const privateKey = this.cryptoService.encoding.encoding(keyPair.secretKey, 'base58')
        const mnemonic = generateMnemonic()

        res({ privateKey, address, mnemonic })
      } catch (e) {
        rej(e)
      }
    })
  }

  public async getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance> {
    const pubKey = new this.client.PublicKey(dto.address)
    const balance = await this.connection.getBalance(pubKey)

    return { balance: new Decimal(balance / this.client.LAMPORTS_PER_SOL) }
  }

  public async sendTx<T extends SupportChains>(
    dto: SendTxByChainDto[T],
  ): Promise<ResponseSendTxDto> {
    const payer = this.client.Keypair.fromSecretKey(
      this.cryptoService.encoding.decoding(dto.privateKey, 'base58'),
    )
    const payerPubKey = payer.publicKey
    const recipientPubKey = new this.client.PublicKey(dto.addressTo)

    const transaction = new this.client.Transaction().add(
      this.client.SystemProgram.transfer({
        fromPubkey: payerPubKey,
        toPubkey: recipientPubKey,
        lamports: dto.amount.toNumber() * this.client.LAMPORTS_PER_SOL,
      }),
    )

    transaction.sign(payer)

    const signature = await this.connection.sendRawTransaction(transaction.serialize())

    return {
      addressFrom: dto.addressFrom,
      addressTo: dto.addressTo,
      amount: dto.amount,
      txHash: signature,
      network: SupportChains.SOL,
    }
  }

  public async getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto> {
    const pubKey = new this.client.PublicKey(dto.address)
    const transactions = await this.connection.getConfirmedSignaturesForAddress2(pubKey, {
      limit: dto.limit,
    })

    const txs: Array<ResponseTxDto> = []

    await Promise.allSettled(
      transactions.map(async tx => {
        const infoTx = await this.connection.getTransaction(tx.signature)

        if (infoTx.transaction) {
          txs.push({
            txHash: tx.signature,
            addressFrom: infoTx.transaction.message.accountKeys[0].toBase58(),
            addressTo: infoTx.transaction.message.accountKeys[1].toBase58(),
            amount: this.getAmountByPubKey(infoTx, infoTx.transaction.message.accountKeys[0]),
            timestamp: 0,
            network: SupportChains.SOL,
            fee: new Decimal(infoTx.meta.fee),
          })
        }
      }),
    )

    return txs
  }

  public async getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto> {
    const infoTx = await this.connection.getTransaction(dto.txHash)

    return {
      addressFrom: infoTx.transaction.message.accountKeys[0].toBase58(),
      addressTo: infoTx.transaction.message.accountKeys[1].toBase58(),
      txHash: dto.txHash,
      fee: new Decimal(infoTx.meta.fee),
      timestamp: 0,
      amount: this.getAmountByPubKey(infoTx, infoTx.transaction.message.accountKeys[0]),
      blockNumber: BigInt(0),
    }
  }

  public async sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    const toPubKey = new this.client.PublicKey(dto.toAddress)
    const tokenPubKey = new this.client.PublicKey(dto.tokenAddress)

    const payer = this.client.Keypair.fromSecretKey(
      this.cryptoService.encoding.decoding(dto.privateKey, 'base58'),
    )

    const token = new Token(this.connection, tokenPubKey, TOKEN_PROGRAM_ID, payer)

    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(payer.publicKey)
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(toPubKey)

    const transactionInstruction = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      toTokenAccount.address,
      payer.publicKey,
      [],
      dto.amount.toNumber(),
    )

    const transaction = new this.client.Transaction().add(transactionInstruction)
    transaction.sign(payer)

    const signature = await this.connection.sendRawTransaction(transaction.serialize())

    return {
      txHash: signature,
      tokenName: dto.tokenName,
      addressFrom: payer.publicKey.toBase58(),
      addressTo: toPubKey.toBase58(),
      fee: new Decimal(await transaction.getEstimatedFee(this.connection)),
      amount: dto.amount,
    }
  }

  private getAmountByPubKey(
    tx: SolanaWeb3.TransactionResponse,
    pubKey: SolanaWeb3.PublicKey,
  ): Decimal {
    const index = tx.transaction.message.accountKeys.findIndex(key => key.equals(pubKey))
    const meta = tx.meta
    const preBalance = new Decimal(meta.preBalances[index] || 0).div(this.client.LAMPORTS_PER_SOL)
    const postBalance = new Decimal(meta.postBalances[index] || 0).div(this.client.LAMPORTS_PER_SOL)

    return postBalance.minus(preBalance)
  }
}
