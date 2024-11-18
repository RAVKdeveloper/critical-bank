import { Module } from '@nestjs/common'
import { CryptoService } from './core/crypto.service'
import { HashService } from './core/hash/hash.service'
import { EncodingService } from './core/encoding/encoding.service'
import { EncryptingService } from './core/encrypting/encrypting.service'

@Module({
  providers: [CryptoService, HashService, EncodingService, EncryptingService],
  exports: [CryptoService, HashService, EncodingService, EncryptingService],
})
export class CryptoModule {}
