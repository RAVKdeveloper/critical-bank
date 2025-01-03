// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.1
//   protoc               v5.28.3
// source: proto/private-keys.proto

/* eslint-disable */
import { SupportChains } from '@lib/web3/core/types'
import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices'
import { Observable } from 'rxjs'

export const protobufPackagePrivateKeys = 'privateKeys'

export interface GetPrivateKeyHashMsg {
  remainderFingerprint: string
}

export interface ResponsePrivateKeyHashMsg {
  privateKeyHash: string
}

export interface SignDataByPrivateKeyMsg {
  remainderFingerprint: string
  data: Uint8Array
  chain: SupportChains
}

export interface ResponseSignDataByPrivateKeyMsg {
  signature: Uint8Array
}

export interface IsValidPubKeyMsg {
  address: Uint8Array
  remainderFingerprint: string
}

export interface ResponseIsValidPubKeyMsg {
  valid: boolean
  timestamp: number
}

export const PRIVATE_KEYS_PACKAGE_NAME = 'privateKeys'

export interface PrivateKeysServiceClient {
  getPrivateKeyHash(request: GetPrivateKeyHashMsg): Observable<ResponsePrivateKeyHashMsg>

  signDataByPrivateKey(
    request: SignDataByPrivateKeyMsg,
  ): Observable<ResponseSignDataByPrivateKeyMsg>

  isValidAddress(request: IsValidPubKeyMsg): Observable<ResponseIsValidPubKeyMsg>
}

export interface PrivateKeysServiceController {
  getPrivateKeyHash(
    request: GetPrivateKeyHashMsg,
  ):
    | Promise<ResponsePrivateKeyHashMsg>
    | Observable<ResponsePrivateKeyHashMsg>
    | ResponsePrivateKeyHashMsg

  signDataByPrivateKey(
    request: SignDataByPrivateKeyMsg,
  ):
    | Promise<ResponseSignDataByPrivateKeyMsg>
    | Observable<ResponseSignDataByPrivateKeyMsg>
    | ResponseSignDataByPrivateKeyMsg

  isValidAddress(
    request: IsValidPubKeyMsg,
  ):
    | Promise<ResponseIsValidPubKeyMsg>
    | Observable<ResponseIsValidPubKeyMsg>
    | ResponseIsValidPubKeyMsg
}

export function PrivateKeysServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ['getPrivateKeyHash', 'signDataByPrivateKey', 'isValidAddress']
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcMethod('PrivateKeysService', method)(constructor.prototype[method], method, descriptor)
    }
    const grpcStreamMethods: string[] = []
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method)
      GrpcStreamMethod('PrivateKeysService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      )
    }
  }
}

export const PRIVATE_KEYS_SERVICE_NAME = 'PrivateKeysService'
