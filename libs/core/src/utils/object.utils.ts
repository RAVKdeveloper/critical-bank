import { bytesToUtf8 } from '@noble/ciphers/utils'
import { utf8ToBytes } from '@noble/hashes/utils'
import RLP from 'rlp'

export const objToString = (value: unknown): string => {
  return typeof value === 'object' ? JSON.stringify(value) : `${value}`
}

export const stringifyObjectRaw = (val: unknown): Uint8Array => {
  if (typeof val !== 'object') {
    throw new Error('Value must be object type!' + ' Received' + ' ' + typeof val)
  }

  const resultObj = {}
  const meta = {}

  Object.entries(val).forEach(([k, v]) => {
    if (typeof v === 'bigint') {
      v = v.toString()
      meta[k] = 'bigint'
    }

    if (typeof v === 'object') {
      v = stringifyObjectRaw(v)
      meta[k] = 'object'
    }

    resultObj[k] = v
  })

  return RLP.encode([utf8ToBytes(JSON.stringify(resultObj)), utf8ToBytes(JSON.stringify(meta))])
}

export const rawBytesToObject = (input: Uint8Array): Record<string, any> => {
  const uintArr = RLP.decode(input) as Uint8Array[]

  if (uintArr.length !== 2) {
    throw new Error('Invalid input length! Expect 2 items in array')
  }

  const receivedObj: Record<string, any> = JSON.parse(bytesToUtf8(uintArr[1]))
  const receivedMeta: Record<string, any> = JSON.parse(bytesToUtf8(uintArr[2]))

  const result: Record<string, any> = {}

  Object.entries(receivedObj).forEach(([k, v]) => {
    const metaValue = receivedMeta[k]

    if (!metaValue) {
      result[k] = v
      return
    }

    if (metaValue === 'bigint') {
      v = BigInt(v)
      result[k] = v
      return
    }

    if (metaValue === 'object') {
      v = rawBytesToObject(v)
      result[k] = v
      return
    }
  })

  return result
}
