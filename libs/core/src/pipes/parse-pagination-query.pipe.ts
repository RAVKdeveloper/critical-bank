import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseQueryPaginationPipe<T extends object> implements PipeTransform<T> {
    constructor() {}

    async transform(value: T) {
        const intObj: Record<string, number> = {};

        Object.entries(value).map(([key, val]) => {
            if (isNaN(Number(val))) {
                throw new BadRequestException(`ParseQueryPaginationPipe validation failed.`);
            }

            intObj[key] = +val;
        });

        return intObj;
    }
}
