/* eslint-disable */

import { getClient } from '../migrations-utils/db'

import { NotificationEntity, NotificationSchema } from '../schemas'

export const up = async () => {
  const client = await getClient()
  const NotificationEntityModel = client.model(NotificationEntity.schemaName, NotificationSchema)
  const inst = await NotificationEntityModel.create({ body: '0', userId: '0' })
  await inst.save()
}

export const down = async () => {
  throw new Error('This migration not down')
}
