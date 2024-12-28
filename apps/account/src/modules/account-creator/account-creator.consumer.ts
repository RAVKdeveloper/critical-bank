import {
  AccountMsgPatterns,
  CreateBankAccountMsg,
  CreateCryptoWalletMsg,
  KafkaAccountCreatorController,
} from '@lib/kafka-types'
import { Controller } from '@nestjs/common'
import { AccountCreatorService } from './account-creator.service'
import { EventPattern, Payload } from '@nestjs/microservices'
import { Transactional } from '@nestjs-cls/transactional'

@Controller()
export class AccountCreatorConsumer implements KafkaAccountCreatorController {
  constructor(private readonly accountCreatorService: AccountCreatorService) {}

  @EventPattern(AccountMsgPatterns.EVENT_CREATE_BANK_ACCOUNT)
  @Transactional()
  public async createBankAccount(@Payload() dto: CreateBankAccountMsg): Promise<void> {
    return await this.accountCreatorService.createBankAccount(dto)
  }

  @EventPattern(AccountMsgPatterns.EVENT_CREATE_CRYPTO_WALLET)
  @Transactional()
  public async createCryptoWallet(@Payload() dto: CreateCryptoWalletMsg): Promise<void> {}
}
