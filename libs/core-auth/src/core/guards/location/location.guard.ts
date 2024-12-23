import { Request } from 'express'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { parse } from 'express-useragent'
import { RequestHeaders } from '@libs/constants'
import { IP, UserLocation } from '@libs/core'

@Injectable()
export class LocationGuard implements CanActivate {
  public canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = ctx.switchToHttp().getRequest()
    let ip = request.headers['x-forwarded-for'] || request.socket?.remoteAddress

    if (!ip || ip.length === 0) throw new ForbiddenException('Не удалось определить ip аддрес')

    if (Array.isArray(ip)) ip = ip.join(',')

    const parsedData = parse(request['user-agent'])

    const locationData: UserLocation = {
      ip: ip as IP,
      device: parsedData.platform,
      isBot: parsedData.isBot,
      os: parsedData.os,
      deviceType: parsedData.isMobile ? 'mobile' : 'desktop',
    }

    request[RequestHeaders.LOCATION] = locationData

    return true
  }
}
