export enum Table {
  USER_ACTIVITY = 'user_activity',
  LOGS = 'logs',
}

export interface TableEntities {
  [Table.USER_ACTIVITY]: UserActivity
  [Table.LOGS]: Logs
}

export class Logs {
  readonly userId: string
  readonly level: string
  readonly message: string
  readonly timestamp: string
  readonly service: string
  readonly data: any

  constructor(createParam: {
    userId: string
    level: string
    data?: any
    service?: string
    message: string
  }) {
    this.userId = createParam.userId
    this.level = createParam.level
    this.message = createParam.message
    this.data = JSON.stringify(createParam.data ?? {})
    this.timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, '')
    this.service = createParam.service ?? 'APP'
  }
}

export class UserActivity {
  readonly userId: string
  readonly deviceId: string
  readonly appId: string
  readonly timestamp: string

  constructor(createParam: { userId: string; deviceId: string; appId: string; timestamp: Date }) {
    this.userId = createParam.userId
    this.deviceId = createParam.deviceId
    this.appId = createParam.appId
    this.timestamp = createParam.timestamp
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, '')
  }
}
