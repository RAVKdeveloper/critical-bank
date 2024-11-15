import { TransformFnParams } from 'class-transformer'

export const numTransformer = (p: TransformFnParams): number => {
  const val = Number(p.value)

  if (isNaN(val)) {
    throw new Error(`Transformer error, expect number, received ${val}`)
  }

  return val
}
