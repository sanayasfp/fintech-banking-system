export interface CursorPaginationOptions {
    limit: number;
    cursor?: string;
}

export interface CursorPaginatedResult<T> {
    items: T[];
    nextCursor: string | null;
    hasMore: boolean;
}
