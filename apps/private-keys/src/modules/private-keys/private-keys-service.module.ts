import { Module } from '@nestjs/common'
import { MongoRepoModule } from '@lib/mongo-repo'
import { KafkaPrivateKeysController } from './private-keys-service.kafka-consumer'
import { PrivateKeysService } from './private-keys-service.service'
import { CryptoModule } from '@lib/crypto'
import { ConfigModule } from '../../config/config.module'
import { Web3Module } from '@lib/web3'
import { SignatoryModule } from '../signatory/signatory.module'

@Module({
  imports: [MongoRepoModule, CryptoModule, ConfigModule, Web3Module, SignatoryModule],
  controllers: [KafkaPrivateKeysController],
  providers: [PrivateKeysService],
  exports: [PrivateKeysService],
})
export class PrivateKeysServiceModule {}
