import { Inject, Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common'
import { UUID, randomUUID as uuidV4 } from 'node:crypto'
import {
  CreateBankAccountMsg,
  CreateCryptoWalletMsg,
  PRIVATE_KEYS_SERVICE_NAME,
} from '@lib/kafka-types'
import { LokiLogger } from '@lib/loki'
import { BankCryptoWallet, RepositoryService } from '@libs/repository'
import { CryptoService } from '@lib/crypto'
import { UserIsBlockedError, stringifyObjectRaw, subscribeTo } from '@libs/core'
import { ClientKafka, RpcException } from '@nestjs/microservices'
import { BankAccountHasAlreadyCreatedError } from './account-creator.errors'
import { Web3Service, transformCryptoCurrencyToChain } from '@lib/web3'
import {
  PrivateKeyServiceMsgPatterns,
  SavePrivateKeyMsg,
  PrivateKeysMessagePattern,
} from './broker-subs'
import { ConfigService } from '@libs/config'
import { ConfigModel } from '../../config/config.model'

@Injectable()
export class AccountCreatorService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    private readonly rep: RepositoryService,
    private readonly logger: LokiLogger,
    private readonly cryptoService: CryptoService,
    private readonly web3Service: Web3Service,
    @Inject(PRIVATE_KEYS_SERVICE_NAME) private client: ClientKafka,
    private readonly cfg: ConfigService<ConfigModel>,
  ) {}

  public async onModuleInit() {
    subscribeTo(this.client, PrivateKeyServiceMsgPatterns)
    await this.client.connect()
  }

  public async onApplicationShutdown() {
    await this.client.close()
  }

  public async createBankAccount(dto: CreateBankAccountMsg) {
    const validatedUser = await this.getUser(dto.userId)
    const accountNumber = await this.generateAccountNumber(dto)

    try {
      await this.rep.bankAccount.save({
        accountNumber,
        currency: dto.currency,
        accountName: dto.accountName,
        affiliation: dto.affiliation,
        accountType: dto.accountType,
        isPremiumAccount: dto.isPremiumAccount,
        user: { id: validatedUser.id },
      })

      this.logger.log(
        `Successful create new bank account! Account number - ${accountNumber}, user id - ${validatedUser.id}`,
      )
    } catch {
      this.logger.log(
        `Error on create bank account! User id: ${validatedUser.id}, account number ${accountNumber}, other data: ${dto}`,
      )
      throw new RpcException(new BankAccountHasAlreadyCreatedError(validatedUser.id, accountNumber))
    }
  }

  public async createCryptoWallet(dto: CreateCryptoWalletMsg) {
    const user = await this.getUser(dto.userId)
    const chains = transformCryptoCurrencyToChain(dto.cryptoCurrency)

    const wallets: BankCryptoWallet[] = []
    const key = this.cfg.env.PK_ENCRYPT_KEY

    for await (const chain of chains) {
      const newChainAccount = await this.web3Service.createAccount(chain)
      const encryptedKey = await this.cryptoService.encrypting.encryptSyncWithIv(
        newChainAccount.privateKey,
        key,
      )
      const pkFingerprint = await this.cryptoService.fingerprint.createFingerprintFromPrivateKey(
        encryptedKey,
        key,
      )
      const remainderFingerprint = this.cryptoService.fingerprint.reminderFingerprint(
        pkFingerprint.fingerprint,
      )

      const cryptoWallet = this.rep.cryptoWallet.create({
        cryptoCurrency: dto.cryptoCurrency,
        privateKeyFingerprint: remainderFingerprint,
        address: newChainAccount.address,
        user: { id: user.id },
      })

      this.client.emit<any, SavePrivateKeyMsg>(PrivateKeysMessagePattern.SAVE_PRIVATE_KEY, {
        encryptedPrivateKey: encryptedKey,
      })

      wallets.push(cryptoWallet)
    }

    await this.rep.cryptoWallet.save(wallets)
  }

  private async getUser(userId: UUID) {
    const user = await this.rep.user.findOne({
      where: { id: userId },
      select: {
        id: true,
        isBlocked: true,
      },
    })

    if (!user || user.isBlocked) {
      this.logger.log(`The blocked user tried to create a bank account (user id = ${userId})`)
      throw new RpcException(new UserIsBlockedError(userId))
    }

    return user
  }

  private async generateAccountNumber(dto: CreateBankAccountMsg) {
    const randomUUID = uuidV4()
    const obj = stringifyObjectRaw({
      ...dto,
      randomUUID,
    })
    const bytes = this.cryptoService.encoding
      .decoding(await this.cryptoService.hash.lightHash(obj, 'hex'), 'hex')
      .slice(-20)

    return this.cryptoService.encoding.encoding(bytes, 'base64')
  }
}
