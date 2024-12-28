import { ClientKafka } from '@nestjs/microservices'

export const subscribeTo = (client: ClientKafka, patterns: string[]) => {
  patterns.forEach(pattern => {
    client.subscribeToResponseOf(pattern)
  })
}
