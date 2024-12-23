import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiCookieAuth } from '@nestjs/swagger'

import { BaseAuthGuard, LocationGuard, PreAuthGuard } from '@lib/core-auth'

export const CommonAuth = () =>
  applyDecorators(ApiCookieAuth, UseGuards(BaseAuthGuard), UseGuards(LocationGuard))

export const PreAuth = () =>
  applyDecorators(ApiCookieAuth, UseGuards(PreAuthGuard), UseGuards(LocationGuard))
