import {
  Entity,
  Column,
  Index,
  ManyToOne,
  Relation,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { BankAccountEntity } from './bank-account.entity'
import { CardLimitsEntity } from './card-limits.entity'
import { FiatTransactionEntity } from './transactions/transaction.entity'
import { PaymentSystemEnum, CardType, CardVariant } from '../enums'

import type { Nullable } from '@libs/core'
import { ColumnNumericTransformer } from '../transformers'

@Entity({ name: 'bank_card' })
export class BankCardEntity extends BaseEntity {
  @Column({ name: 'card_number', unique: true, type: 'varchar', length: 16 })
  readonly cardNumber: string

  @Column({ name: 'card_type', enum: CardType, type: 'enum', default: CardType.DEBIT })
  readonly cardType: CardType

  @Column({ name: 'expiration_time', type: 'varchar', length: 5 })
  readonly expirationTime: string

  @Column({ name: 'cvv_code' })
  readonly cvvCode: string

  @Column({ name: 'is_named_card', type: 'boolean', default: false })
  readonly isNamedCard: boolean

  @Column({ name: 'is_blocked', default: false })
  readonly isBlocked: boolean

  @Column({
    name: 'card_balance',
    type: 'numeric',
    precision: 70,
    scale: 5,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  readonly cardBalance: number

  @Column({
    type: 'enum',
    enum: PaymentSystemEnum,
    name: 'payment_system',
    default: PaymentSystemEnum.MIR,
  })
  readonly paymentSystem: PaymentSystemEnum

  @Column({ name: 'pin_code', nullable: true, default: null, type: 'varchar' })
  readonly pinCode: Nullable<string>

  @Column({ name: 'card_issue_date', type: 'timestamp' })
  readonly cardIssueDate: Date

  @Column({ name: 'card_variant', type: 'enum', enum: CardVariant, default: CardVariant.COMMON })
  readonly cardVariant: CardVariant

  @Column({ name: 'has_plastic', default: false })
  readonly hasPlastic: boolean

  @ManyToOne(() => BankAccountEntity, acc => acc)
  @JoinColumn({ name: 'bank_account_id', referencedColumnName: 'id' })
  readonly bankAccount: Relation<BankAccountEntity>

  @OneToOne(() => CardLimitsEntity, cardLimits => cardLimits.card)
  @JoinColumn({ name: 'card_limits_id', referencedColumnName: 'id' })
  readonly cardLimits: Relation<CardLimitsEntity>

  @OneToMany(() => FiatTransactionEntity, tx => tx.sender)
  @JoinColumn({ name: 'transactions_withdraw_id', referencedColumnName: 'id' })
  readonly transactionsWithdraw: Relation<FiatTransactionEntity[]>

  @OneToMany(() => FiatTransactionEntity, tx => tx.recipient)
  @JoinColumn({ name: 'transactions_replenishment_id', referencedColumnName: 'id' })
  readonly transactionsReplenishment: Relation<FiatTransactionEntity[]>
}
