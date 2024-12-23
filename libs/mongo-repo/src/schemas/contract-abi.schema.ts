import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SupportChains, Web3Address } from '@lib/web3/core/types'

@Schema()
export class ContractAbiEntity {
  public static schemaName = 'contract-abi'

  @Prop({ required: true })
  readonly abi: string

  @Prop({ required: true })
  readonly tokenName: string

  @Prop({ required: true })
  readonly address: Web3Address

  @Prop({
    required: true,
    enum: SupportChains,
    type: String,
  })
  readonly chain: SupportChains

  @Prop({ required: true, default: () => new Date() })
  readonly createdAt: Date
}

export const ContractAbiSchema = SchemaFactory.createForClass(ContractAbiEntity)
