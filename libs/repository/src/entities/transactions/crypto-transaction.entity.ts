import { Entity, Column, ManyToOne, JoinColumn, Unique, Relation, Index } from 'typeorm'

import { BaseEntity } from '../../base/base.entity'
import { BankCryptoWallet } from '../index'
import { CryptoEnum, TransactionArticle, TransactionStatus, TransactionType } from '../../enums'

import type { Nullable } from '@libs/core'
import { ColumnNumericTransformer } from '@libs/repository/transformers'

@Entity({ name: 'crypto_transaction' })
@Unique(['networkTxHash', 'cryptoCurrency'])
export class CryptoTransactionEntity extends BaseEntity {
  @Column({ name: 'network_tx_hash', nullable: true, type: 'varchar' })
  readonly networkTxHash: Nullable<string>

  @Column({ name: 'crypto_currency', type: 'enum', enum: CryptoEnum })
  readonly cryptoCurrency: CryptoEnum

  @Column({
    name: 'tx_amount',
    type: 'numeric',
    scale: 5,
    precision: 130,
    transformer: new ColumnNumericTransformer(),
  })
  readonly amount: number

  @Column({
    name: 'tx_fee',
    type: 'numeric',
    scale: 5,
    precision: 50,
    transformer: new ColumnNumericTransformer(),
  })
  readonly fee: number

  @Column({ name: 'type', type: 'enum', enum: TransactionType })
  readonly type: TransactionType

  @Column({ name: 'article', type: 'enum', enum: TransactionArticle })
  readonly article: TransactionArticle

  @Column({
    name: 'tx_status',
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  readonly transactionStatus: TransactionStatus

  @ManyToOne(() => BankCryptoWallet, wallet => wallet.transactionsWithdraw, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'sender_crypto_wallet_id', referencedColumnName: 'id' })
  readonly sender: Relation<BankCryptoWallet>

  @ManyToOne(() => BankCryptoWallet, wallet => wallet.transactionsReplenishment, {
    onDelete: 'CASCADE',
    cascade: true,
  })
  @JoinColumn({ name: 'recipient_crypto_wallet_id', referencedColumnName: 'id' })
  readonly recipient: Relation<BankCryptoWallet>
}
