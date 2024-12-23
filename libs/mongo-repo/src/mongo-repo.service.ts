import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { NotificationEntity, ContractAbiEntity, PrivateKeyEntity } from './schemas'

@Injectable()
export class MongoRepoService {
  constructor(
    @InjectModel(NotificationEntity.schemaName)
    private readonly notificationModel: Model<NotificationEntity>,
    @InjectModel(ContractAbiEntity.schemaName)
    private readonly contractAbiModel: Model<ContractAbiEntity>,
    @InjectModel(PrivateKeyEntity.schemaName)
    private readonly privateKeyModel: Model<PrivateKeyEntity>,
  ) {}

  public get notification() {
    return this.notificationModel
  }

  public get contractAbi() {
    return this.contractAbiModel
  }

  public get privateKey() {
    return this.privateKeyModel
  }
}
