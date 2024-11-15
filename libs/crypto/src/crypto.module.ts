import { Module } from '@nestjs/common'
import { CryptoService } from './core/crypto.service'
import { HashService } from './core/hash/hash.service'
import { EncodingService } from './core/encoding/encoding.service'

@Module({
  providers: [CryptoService, HashService, EncodingService],
  exports: [CryptoService],
})
export class CryptoModule {}
