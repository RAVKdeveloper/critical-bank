import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { NotificationEntity } from './schemas'

@Injectable()
export class MongoRepoService {
  constructor(
    @InjectModel(NotificationEntity.schemaName)
    private readonly notificationModel: Model<NotificationEntity>,
  ) {}

  public get notification() {
    return this.notificationModel
  }
}
