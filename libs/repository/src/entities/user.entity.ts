import { Entity, Column, OneToMany, Relation } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { BankAccountEntity, BankCryptoWallet } from './index'

import { ColumnBigIntTransformer } from '../transformers'

import type { Nullable } from '@libs/core'

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({
    name: 'tg_id',
    nullable: true,
    type: 'bigint',
    transformer: new ColumnBigIntTransformer({ isNullableColumn: true }),
    default: null,
    unique: true,
  })
  readonly tgId: Nullable<number>

  @Column({ name: 'user_name', type: 'varchar' })
  readonly userName: string

  @Column({ name: 'user_surname', type: 'varchar' })
  readonly userSurname: string

  @Column({ name: 'user_last_name', type: 'varchar', nullable: true, default: null })
  readonly userLastName: Nullable<string>

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
