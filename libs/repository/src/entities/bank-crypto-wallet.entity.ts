import { Entity, Column, ManyToOne, Relation, JoinColumn, OneToMany } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { UserEntity, CryptoTransactionEntity } from './index'
import { CryptoEnum } from '../enums'

@Entity({ name: 'bank_crypto_wallet' })
export class BankCryptoWallet extends BaseEntity {
  @Column({ name: 'crypto_currency', type: 'enum', enum: CryptoEnum })
  readonly cryptoCurrency: CryptoEnum

  @Column({ name: 'public_key' })
  readonly publicKey: string

  @Column({ name: 'private_key' })
  readonly privateKey: string

  @Column({ name: 'address' })
  readonly address: string

  @ManyToOne(() => UserEntity, user => user.wallets, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  readonly user: Relation<UserEntity>

  @OneToMany(() => CryptoTransactionEntity, tx => tx.sender)
  @JoinColumn({ name: 'crypto_transactions_withdraw_id', referencedColumnName: 'id' })
  readonly transactionsWithdraw: Relation<CryptoTransactionEntity[]>

  @OneToMany(() => CryptoTransactionEntity, tx => tx.recipient)
  @JoinColumn({ name: 'crypto_transactions_replenishment_id', referencedColumnName: 'id' })
  readonly transactionsReplenishment: Relation<CryptoTransactionEntity[]>
}
