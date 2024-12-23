import { RequestHeaders } from '@libs/constants'
import { BadRequestError } from '@libs/core/errors'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const Location = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const location = request[RequestHeaders.LOCATION]

  if (!location) {
    throw new BadRequestError('Not found location metadata!')
  }

  return location
})
