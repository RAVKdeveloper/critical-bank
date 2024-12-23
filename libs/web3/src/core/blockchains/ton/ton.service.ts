import { TonClient, WalletContractV4, internal, Address, toNano } from '@ton/ton'
import { mnemonicNew, mnemonicToPrivateKey, keyPairFromSecretKey } from '@ton/crypto'
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
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@libs/config'
import { Web3EnvsModel } from '../../models/web3.envs.model'
import { Decimal } from 'decimal.js'

@Injectable()
export class TonService implements Web3AbstractService {
  private readonly client: TonClient
  private readonly logger = new Logger(TonService.name)
  private workChain: number

  constructor(private readonly cfg: ConfigService<Web3EnvsModel>) {
    this.client = new TonClient({ endpoint: this.cfg.env.TON_MAIN_URL })
    this.workChain = 0
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

  public async createAccount(): Promise<Web3ResponseCreateAccountDto> {
    const mnemonic = await mnemonicNew()
    const keyPair = await mnemonicToPrivateKey(mnemonic)

    const wallet = WalletContractV4.create({
      workchain: this.workChain,
      publicKey: keyPair.publicKey,
    })
    const contract = this.client.open(wallet)

    const balance: bigint = await contract.getBalance()

    const seqno: number = await contract.getSeqno()
    await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: balance,
          to: wallet.address,
        }),
      ],
    })

    return {
      privateKey: keyPair.secretKey.toString('base64'),
      mnemonic: mnemonic.join(' '),
      address: wallet.address.toString(),
    }
  }

  public async getBalance(dto: GetBalanceDto): Promise<ResponseGetBalance> {
    const balance: bigint = await this.client.getBalance(Address.parse(dto.address))

    return {
      balance: new Decimal(balance.toString()),
    }
  }

  public async sendTx<T extends SupportChains>(
    dto: SendTxByChainDto[T],
  ): Promise<ResponseSendTxDto> {
    const keyPair = keyPairFromSecretKey(Buffer.from(dto.privateKey))
    const wallet = WalletContractV4.create({
      workchain: this.workChain,
      publicKey: keyPair.publicKey,
    })
    const contract = this.client.open(wallet)
    const seqno: number = await contract.getSeqno()
    const msg = await contract.sendTransfer({
      seqno,
      secretKey: keyPair.secretKey,
      messages: [
        internal({
          value: toNano(dto.amount.toString()),
          to: Address.parse(dto.addressTo),
        }),
      ],
    })

    throw new Error('Method not implemented.')
  }

  public getUserTxs(dto: GetUserTxsDto): Promise<ResponseAllUserTxsDto> {
    throw new Error('Method not implemented.')
  }
  public getTxByHash(dto: GetTxByHashDto): Promise<ResponseTxByHashDto> {
    throw new Error('Method not implemented.')
  }
  public sendToken(dto: SendTokenDto): Promise<ResponseSendTokenDto> {
    throw new Error('Method not implemented.')
  }
}
