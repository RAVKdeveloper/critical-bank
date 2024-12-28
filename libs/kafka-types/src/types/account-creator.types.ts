import { UUID } from '@libs/core'
import {
  BankAccAffiliationEnum,
  BankAccountTypes,
  CryptoEnum,
  CurrencyEnum,
} from '@libs/repository'

export const ACCOUNT_CONSUMER = 'account-consumer'
export const ACCOUNT_SERVICE_NAME = 'ACCOUNT_SERVICE'
export const ACCOUNT_CLIENT_ID = 'account-services'

export enum AccountMsgPatterns {
  EVENT_CREATE_BANK_ACCOUNT = 'EVENT_CREATE_BANK_ACCOUNT',
  EVENT_CREATE_CRYPTO_WALLET = 'EVENT_CREATE_CRYPTO_WALLET',
}

export interface CreateBankAccountMsg {
  userId: UUID
  accountType: BankAccountTypes
  isPremiumAccount: boolean
  affiliation: BankAccAffiliationEnum
  currency: CurrencyEnum
  accountName?: string
}

export interface CreateCryptoWalletMsg {
  cryptoCurrency: CryptoEnum
  userId: UUID
}

export interface KafkaAccountCreatorController {
  // Event
  createBankAccount: (dto: CreateBankAccountMsg) => Promise<void>
  // Event
  createCryptoWallet: (dto: CreateCryptoWalletMsg) => Promise<void>
}
