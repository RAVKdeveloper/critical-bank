import { CryptoEnum } from '@libs/repository'
import { SupportChains } from '../core/types'

export const transformCryptoCurrencyToChain = (cur: CryptoEnum): SupportChains[] => {
  const chainObj: Record<CryptoEnum, SupportChains[]> = {
    [CryptoEnum.ETH]: [SupportChains.ETH],
    [CryptoEnum.USDT]: [SupportChains.ETH, SupportChains.TRON, SupportChains.SOL],
    [CryptoEnum.BTC]: [SupportChains.BITCOIN],
    [CryptoEnum.TON]: [SupportChains.TON],
  }

  return chainObj[cur]
}
