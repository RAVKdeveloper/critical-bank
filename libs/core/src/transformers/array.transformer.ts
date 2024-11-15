import { TransformFnParams } from 'class-transformer'

export const arrayTransformer = (p: TransformFnParams): string[] => {
  let val = p.value
  val = (val as string).split(',')

  if (!Array.isArray(val)) {
    throw new Error(`Transformer error, expect array, received ${val}`)
  }

  return val
}
