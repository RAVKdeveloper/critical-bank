import { TransactionHost } from '@nestjs-cls/transactional'
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm'
import { Injectable } from '@nestjs/common'

import {
  UserEntity,
  BankAccountEntity,
  BankCardEntity,
  CardLimitsEntity,
  BankCryptoWallet,
  FiatTransactionEntity,
  CryptoTransactionEntity,
} from './entities'

@Injectable()
export class RepositoryService {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterTypeOrm>) {}

  public get user() {
    return this.txHost.tx.getRepository(UserEntity)
  }

  public get bankAccount() {
    return this.txHost.tx.getRepository(BankAccountEntity)
  }

  public get bankCard() {
    return this.txHost.tx.getRepository(BankCardEntity)
  }

  public get cardLimits() {
    return this.txHost.tx.getRepository(CardLimitsEntity)
  }

  public get cryptoWallet() {
    return this.txHost.tx.getRepository(BankCryptoWallet)
  }

  public get fiatTx() {
    return this.txHost.tx.getRepository(FiatTransactionEntity)
  }

  public get cryptoTx() {
    return this.txHost.tx.getRepository(CryptoTransactionEntity)
  }
}
