import { Entity, Column, ManyToOne, Relation, JoinColumn, OneToMany, Unique } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { UserEntity, CryptoTransactionEntity } from './index'
import { CryptoEnum } from '../enums'
import { Nullable } from '@libs/core'
import { ColumnNumericTransformer } from '../transformers'

@Entity({ name: 'bank_crypto_wallet' })
@Unique(['address', 'cryptoCurrency'])
export class BankCryptoWallet extends BaseEntity {
  @Column({ name: 'crypto_currency', type: 'enum', enum: CryptoEnum })
  readonly cryptoCurrency: CryptoEnum

  @Column({ name: 'public_key', nullable: true, default: null, type: 'varchar' })
  readonly publicKey: Nullable<string>

  @Column({ name: 'private_key_fingerprint', type: 'varchar' })
  readonly privateKeyFingerprint: string

  @Column({ name: 'address' })
  readonly address: string

  @Column({
    name: 'token_balance',
    type: 'numeric',
    precision: 100,
    scale: 10,
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  tokenBalance: number

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  readonly isBlocked: boolean

  @ManyToOne(() => UserEntity, user => user.wallets, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  readonly user: Relation<UserEntity>

  @OneToMany(() => CryptoTransactionEntity, tx => tx.sender)
  readonly transactionsWithdraw: Relation<CryptoTransactionEntity[]>

  @OneToMany(() => CryptoTransactionEntity, tx => tx.recipient)
  readonly transactionsReplenishment: Relation<CryptoTransactionEntity[]>
}
