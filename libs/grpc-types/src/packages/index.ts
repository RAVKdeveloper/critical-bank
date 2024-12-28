import { PRIVATE_KEYS_PACKAGE_NAME } from '../proto/private-keys'
import { ACCOUNT_PACKAGE_NAME } from '../proto/account'

export enum GrpcPackage {
  PRIVATE_KEYS = PRIVATE_KEYS_PACKAGE_NAME,
  ACCOUNTS = ACCOUNT_PACKAGE_NAME,
}
