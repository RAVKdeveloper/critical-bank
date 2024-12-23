import { Entity, OneToOne, Column, JoinColumn, Relation } from 'typeorm'

import { BaseEntity } from '../base/base.entity'
import { BankCardEntity } from './index'

@Entity({ name: 'card_limits' })
export class CardLimitsEntity extends BaseEntity {
  @OneToOne(() => BankCardEntity, card => card.cardLimits, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  readonly card: Relation<BankCardEntity>

  @Column({ name: 'max_un_commission_money_per_day' })
  readonly maxUnCommissionMoneyPerDay: number

  @Column({ name: 'max_un_commission_nal_money_per_day' })
  readonly maxUnCommissionNalMoneyPerDay: number

  @Column({ name: 'default_card_percent_per_tx', type: 'float4' })
  readonly defaultCardPercentPerTx: number

  @Column({ name: 'limit_percent_per_tx', type: 'float4' })
  readonly limitPercentPerTx: number

  @Column({ name: 'is_can_by_online_purchases', type: 'boolean', default: true })
  readonly isCanBuyOnlinePurchases: boolean
}
