import { HttpService } from '@nestjs/axios'
import { Inject, Injectable } from '@nestjs/common'
import { GrafanaModuleOptions } from './types/module.types'
import { AxiosError } from 'axios'
import { firstValueFrom, catchError } from 'rxjs'
import { LokiLogFormat as LokiLogLine } from './types/loki.types'

@Injectable()
export class LokiService {
  private readonly lokiPushUrl: URL

  constructor(
    @Inject('GRAFANA_CONFIG') private readonly config: GrafanaModuleOptions,
    private readonly httpService: HttpService,
  ) {
    this.lokiPushUrl = new URL(this.config.lokiEndpoint)
    this.lokiPushUrl.pathname = '/loki/api/v1/push'
  }

  public async push<T>(log: LokiLogLine<T>) {
    const body = JSON.stringify(log)

    const logs = {
      streams: [
        {
          stream: {
            env: process.env.NODE_ENV ?? 'undefined',
            app: process.env.APP ?? 'critical-bank',
          },
          values: [[(Date.now() * 1e6).toString(), body]],
        },
      ],
    }

    try {
      await firstValueFrom(
        this.httpService
          .post(this.lokiPushUrl.toString(), logs, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              if (error.response) {
                console.log(error.response.data)
              } else {
                console.log(error.toJSON())
              }
              throw error
            }),
          ),
      )
    } catch (error) {
      console.log(error)
    }
  }
}
