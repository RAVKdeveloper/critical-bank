export interface KafkaModuleParams {
  readonly serviceName: string
  readonly clientId: string
  readonly brokers: string[]
  readonly groupId: string
}
