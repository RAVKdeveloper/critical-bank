export abstract class NotificationInterface {
  abstract send: (...args: any) => Promise<void>
}
