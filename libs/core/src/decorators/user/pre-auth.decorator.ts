import { RequestHeaders } from '@libs/constants'
import { AppUser } from '@libs/core/types/user'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

const getPreAuthUser = (data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = {
    id: request[RequestHeaders.PRE_AUTH_USER].id,
    tgUser: undefined,
  }

  return user as AppUser
}

export const PreAuthUser = createParamDecorator(getPreAuthUser)
