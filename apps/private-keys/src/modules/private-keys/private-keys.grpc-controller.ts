import {
  GetPrivateKeyHashMsg,
  IsValidPubKeyMsg,
  PrivateKeysServiceController,
  ResponseIsValidPubKeyMsg,
  ResponsePrivateKeyHashMsg,
  ResponseSignDataByPrivateKeyMsg,
  SignDataByPrivateKeyMsg,
  PrivateKeysServiceControllerMethods,
} from '@libs/grpc-types'
import { Controller } from '@nestjs/common'
import { Observable } from 'rxjs'
import { PrivateKeysService } from './private-keys-service.service'

@Controller()
@PrivateKeysServiceControllerMethods()
export class GrpcPrivateKeysController implements PrivateKeysServiceController {
  constructor(private readonly privateKeyService: PrivateKeysService) {}

  public async getPrivateKeyHash(dto: GetPrivateKeyHashMsg): Promise<ResponsePrivateKeyHashMsg> {
    return await this.privateKeyService.getPrivateKeyHash(dto)
  }

  public async signDataByPrivateKey(
    dto: SignDataByPrivateKeyMsg,
  ): Promise<ResponseSignDataByPrivateKeyMsg> {
    return await this.privateKeyService.signDataByPrivateKey(dto)
  }

  public isValidAddress(request: IsValidPubKeyMsg): Promise<ResponseIsValidPubKeyMsg> {
    throw new Error('Method not implemented.')
  }
}
