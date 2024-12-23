import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'
import {
  KafkaPrivateKeysController as ImplementedKafkaController,
  SavePrivateKeyMsg,
  PrivateKeysMessagePattern,
} from '@lib/kafka-types'
import { PrivateKeysService } from './private-keys-service.service'

@Controller()
export class KafkaPrivateKeysController implements ImplementedKafkaController {
  constructor(private readonly privateKeysService: PrivateKeysService) {}

  @EventPattern(PrivateKeysMessagePattern.SAVE_PRIVATE_KEY)
  public async savePrivateKey(@Payload() dto: SavePrivateKeyMsg): Promise<void> {
    return await this.privateKeysService.savePrivateKey(dto)
  }
}
