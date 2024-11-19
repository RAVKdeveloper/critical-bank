import { RequestHeaders } from '@libs/constants'
import { AppUser } from '@libs/core/types/user'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

interface UserData {
  withTg?: boolean
}

const getUser = (data: UserData, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = {
    id: request[RequestHeaders.USER].id,
    tgUser: undefined,
  }

  if (data.withTg) {
    user.tgUser = request.tgUser
  }

  return user as AppUser
}

export const User = createParamDecorator(getUser)
