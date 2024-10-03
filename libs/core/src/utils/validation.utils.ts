import { Injectable, UsePipes, ValidationPipe, ValidationPipeOptions } from '@nestjs/common'
import {
  ValidateBy,
  ValidateIf,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isArray,
  isBoolean,
  isInt,
  isNumber,
  isNumberString,
  isString,
  registerDecorator,
} from 'class-validator'
import Decimal from 'decimal.js'

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      validateCustomDecorators: true,
    })
  }
}

export function UseValidationPipe(options?: ValidationPipeOptions) {
  if (options) {
    return UsePipes(new ValidationPipe(options))
  }
  return UsePipes(new CustomValidationPipe())
}

const InnerTypesValidator = {
  number: isNumber,
  string: isString,
  numberString: isNumberString,
  int: isInt,
  array: isArray,
  boolean: isBoolean,
}

export const IsGenericType = (
  validators: Array<keyof typeof InnerTypesValidator | ((value: unknown) => boolean)>,
  validationOptions?: ValidationOptions,
) =>
  ValidateBy(
    {
      name: 'IS_GENERIC_TYPE',
      validator: {
        validate: (value: unknown) => {
          return validators.some(item =>
            typeof item === 'function' ? item(value) : InnerTypesValidator[item]?.(value),
          )
        },
        defaultMessage: (validationArguments?: ValidationArguments) => {
          return `${validationArguments?.property}: Data type mismatch`
        },
      },
    },
    validationOptions,
  )

@ValidatorConstraint({ name: 'isSort', async: false })
export class IsSort implements ValidatorConstraintInterface {
  validate(sort: [string, 'ASC' | 'DESC']) {
    return typeof sort[0] === 'string' && (sort[1] === 'ASC' || sort[1] === 'DESC')
  }

  defaultMessage() {
    return 'sort must be the tuple [string, "ASC" | "DESC"]'
  }
}

@ValidatorConstraint({ name: 'isRange', async: false })
export class IsRange implements ValidatorConstraintInterface {
  validate(range: [number, number]) {
    return typeof range[0] === 'number' && typeof range[1] === 'number'
  }

  defaultMessage() {
    return 'range must be the tuple [number, number]'
  }
}

export function IsNullable(options?: ValidationOptions): PropertyDecorator {
  return function IsNullableDecorator(prototype: object, propertyKey: string | symbol) {
    ValidateIf(obj => obj[propertyKey] !== null, options)(prototype, propertyKey)
  }
}

@ValidatorConstraint({ name: 'isBigNumberStringValidator' })
@Injectable()
class BigNumberStringValidator implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(value: any) {
    try {
      new Decimal(value)
    } catch {
      return false
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {
    return `Property ${args.property} is not bignumber string`
  }
}

export function IsBigNumberString(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isBigNumberStringValidator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: BigNumberStringValidator,
    })
  }
}
