import type { PaginationDto } from '../types/pagination.type';

export const genPaginationData = ({ limit, page }: PaginationDto) => {
    const skip = (page - 1) * limit;

    return {
        skip,
        take: +limit,
    };
};
