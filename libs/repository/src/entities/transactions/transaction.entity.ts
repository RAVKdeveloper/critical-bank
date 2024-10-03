import { Entity, Column, ManyToOne, JoinColumn, Relation } from 'typeorm'

import { BaseEntity } from '../../base/base.entity'
import { BankCardEntity } from '../index'
import { TransactionArticle, TransactionType, TransactionStatus } from '../../enums'

@Entity({ name: 'fiat_transaction' })
export class FiatTransactionEntity extends BaseEntity {
  @Column({ name: 'type', type: 'enum', enum: TransactionType })
  readonly type: TransactionType

  @Column({ name: 'article', type: 'enum', enum: TransactionArticle })
  readonly article: TransactionArticle

  @ManyToOne(() => BankCardEntity, card => card.transactionsWithdraw, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_card_id', referencedColumnName: 'id' })
  readonly sender: Relation<BankCardEntity>

  @ManyToOne(() => BankCardEntity, card => card.transactionsReplenishment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'recipient_card_id', referencedColumnName: 'id' })
  readonly recipient: Relation<BankCardEntity>

  @Column({ name: 'tx_amount' })
  readonly amount: number

  @Column({ name: 'tx_fee', default: 0 })
  readonly fee: number

  @Column({
    name: 'tx_status',
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  readonly transactionStatus: TransactionStatus
}
