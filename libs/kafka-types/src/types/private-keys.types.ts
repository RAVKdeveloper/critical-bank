export const PRIVATE_KEYS_CONSUMER = 'private-keys-consumer'
export const PRIVATE_KEYS_SERVICE_NAME = 'PRIVATE_KEYS_SERVICE'
export const PRIVATE_KEYS_CLIENT_ID = 'private-keys-services'

export enum PrivateKeysMessagePattern {
  SAVE_PRIVATE_KEY = 'private-keys.save-key',
}

export interface SavePrivateKeyMsg {
  readonly encryptedPrivateKey: Uint8Array // first 32 bytes is a iv
}

export interface KafkaPrivateKeysController {
  savePrivateKey: (dto: SavePrivateKeyMsg) => Promise<void>
}
