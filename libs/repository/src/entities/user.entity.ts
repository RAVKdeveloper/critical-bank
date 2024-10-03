import { Entity, Column, OneToMany, Relation } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { BankAccountEntity, BankCryptoWallet } from './index'

import type { Nullable } from '@libs/core'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ name: 'email', unique: true, nullable: true, type: 'varchar' })
  readonly email: Nullable<string>

  @Column({ name: 'phone_number', unique: true, nullable: true, type: 'varchar' })
  readonly phoneNumber: Nullable<string>

  @Column({ name: 'is_blocked', default: false })
  readonly isBlocked: boolean

  @OneToMany(() => BankAccountEntity, acc => acc.user)
  readonly accounts: Relation<BankAccountEntity[]>

  @OneToMany(() => BankCryptoWallet, wallet => wallet.user)
  readonly wallets: Relation<BankCryptoWallet[]>
}
