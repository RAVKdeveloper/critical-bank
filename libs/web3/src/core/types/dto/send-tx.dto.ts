import { Decimal } from 'decimal.js'
import { Web3Address, SupportChains } from '../common'

export interface CommonSendTxDto {
  readonly addressFrom: Web3Address
  readonly nonce: bigint
  readonly addressTo: Web3Address
  readonly amount: Decimal
  readonly privateKey: string
  readonly fee: bigint
}

export interface TonSendTxDto extends CommonSendTxDto {
  readonly logicalTime: bigint
}

export interface SendTxByChainDto {
  [SupportChains.BITCOIN]: CommonSendTxDto
  [SupportChains.ETH]: CommonSendTxDto
  [SupportChains.TRON]: CommonSendTxDto
  [SupportChains.TON]: TonSendTxDto
  [SupportChains.SOL]: CommonSendTxDto
}

export interface ResponseSendTxDto {
  readonly txHash: string
  readonly amount: Decimal
  readonly addressFrom: Web3Address
  readonly addressTo: Web3Address
  readonly network: SupportChains
}
