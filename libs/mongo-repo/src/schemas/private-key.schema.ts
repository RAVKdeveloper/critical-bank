import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema()
export class PrivateKeyEntity {
  public static schemaName = 'private-key'

  @Prop({ required: true, type: String })
  readonly privateKey: string

  @Prop({ required: true, type: String })
  readonly remainderFingerprint: string

  @Prop({ required: true, default: () => new Date() })
  readonly createdAt: Date
}

export const PrivateKeySchema = SchemaFactory.createForClass(PrivateKeyEntity)
