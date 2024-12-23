import { CryptoModule } from '@lib/crypto'
import { Web3Module } from '@lib/web3'
import { Module } from '@nestjs/common'
import { SignatoryService } from './signatory.service'

@Module({
  imports: [CryptoModule, Web3Module],
  providers: [SignatoryService],
  exports: [SignatoryService],
})
export class SignatoryModule {}
