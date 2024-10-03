import { plainToClass } from 'class-transformer';
import { validate, validateSync } from 'class-validator';

export const toDto = async <D>(dto: new () => D, data: unknown): Promise<D> => {
    const plain = plainToClass(dto, data, {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
    });
    const errors = await validate(plain as Record<string, unknown>, {
        whitelist: true,
        forbidNonWhitelisted: false,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        throw errors;
    }

    return plain;
};

export const toDtoSync = <D>(dto: new () => D, data: unknown): D => {
    const plain = plainToClass(dto, data, {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
    });
    const errors = validateSync(plain as Record<string, unknown>, {
        whitelist: true,
        forbidNonWhitelisted: false,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        throw errors;
    }

    return plain;
};
