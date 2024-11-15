/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RateLimiterError } from '@libs/core'
import { Inject } from '@nestjs/common'
import { RateLimiterService } from '../service/leaky-bucket.service'

export function RateLimit() {
  const injectRateLimiterService = Inject(RateLimiterService)

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    injectRateLimiterService(target, 'rateLimiter')

    const originalMethod = descriptor.value
    descriptor.value = async function (...args: Array<any>) {
      const rateLimiter: RateLimiterService = (this as any).rateLimiter

      const [error, result] = await rateLimiter.execute(
        async () => await originalMethod.apply(this, args),
      )

      if (error) {
        return new RateLimiterError(error.message)
      }

      return result
    }
  }
}
