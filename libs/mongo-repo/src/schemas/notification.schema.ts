import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { NotificationTypeEnum } from '../enums'

@Schema()
export class NotificationEntity {
  public static schemaName = 'notification'

  @Prop({ required: true })
  readonly userId: string

  @Prop({ required: false })
  readonly tgId?: number

  @Prop({ required: false })
  readonly email?: string

  @Prop({
    required: true,
    enum: NotificationTypeEnum,
    default: () => NotificationTypeEnum.BASIC,
    type: String,
  })
  readonly notificationType: NotificationTypeEnum

  @Prop({ required: false })
  readonly title?: string

  @Prop({ required: true })
  readonly body: string

  @Prop({ required: false })
  readonly extraData?: string

  @Prop({ required: true, default: () => new Date() })
  readonly createdAt: Date

  @Prop({ required: true, default: () => false })
  readonly isRead: boolean
}

export const NotificationSchema = SchemaFactory.createForClass(NotificationEntity)
