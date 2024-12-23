export type IP = `${number}.${number}.${number}.${number}`
export type DeviceType = 'mobile' | 'desktop'

export class UserLocation {
  ip: IP
  device: string
  browser?: string
  isBot: boolean
  os: string
  deviceType: DeviceType
}
