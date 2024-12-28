import { Entity, Column, ManyToOne, Index, JoinColumn, Relation, OneToMany } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { CurrencyEnum, BankAccAffiliationEnum, BankAccountTypes } from '../enums'
import { UserEntity, BankCardEntity } from './index'

import type { Nullable } from '@libs/core'
import { ColumnNumericTransformer } from '../transformers'

@Entity({ name: 'bank_account' })
export class BankAccountEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, name: 'account_number', unique: true })
  readonly accountNumber: string

  @Column({ type: 'enum', enum: CurrencyEnum, name: 'currency', default: CurrencyEnum.RUB })
  readonly currency: CurrencyEnum

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'account_name' })
  readonly accountName: Nullable<string>

  @Column({
    name: 'balance',
    type: 'numeric',
    precision: 100,
    scale: 5,
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  readonly balance: number

  @Column({ type: 'enum', enum: BankAccAffiliationEnum, default: BankAccAffiliationEnum.PERSONAL })
  readonly affiliation: BankAccAffiliationEnum

  @Column({
    type: 'enum',
    enum: BankAccountTypes,
    default: BankAccountTypes.COMMON,
    name: 'account_type',
  })
  readonly accountType: BankAccountTypes

  @Column({ name: 'is_blocked', default: false })
  readonly isBlocked: boolean

  @Column({ name: 'is_premium_account', default: false })
  readonly isPremiumAccount: boolean

  @ManyToOne(() => UserEntity, user => user.accounts, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  readonly user: Relation<UserEntity>

  @OneToMany(() => BankCardEntity, card => card.bankAccount)
  readonly cards: Relation<BankCardEntity[]>
}
