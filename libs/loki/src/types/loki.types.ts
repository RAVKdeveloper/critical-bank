export type LokiLogFormat<T> = {
  key: string
  method: string
  path: string
  status: number
  timestamp: Date
  type: 'http' | 'https' | 'application'
  time: number
  data?: T
  userId?: string
}

export type LokiLogError = {
  statusCode: number
  name: string
  message: string
}
