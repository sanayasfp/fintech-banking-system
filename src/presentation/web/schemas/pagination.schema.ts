import { Type, type TSchema } from '@sinclair/typebox';

/**
 * Creates a cursor-paginated result schema for a given item schema
 * @param itemSchema - The schema for individual items
 * @returns A schema for cursor-paginated results
 */
export const CursorPaginatedResultSchema = <T extends TSchema>(itemSchema: T) =>
    Type.Object({
        items: Type.Array(itemSchema),
        nextCursor: Type.Union([Type.String(), Type.Null()]),
        hasMore: Type.Boolean(),
    });


export const PaginationLimitSchema = () => Type.Optional(Type.Transform(
    Type.Union([Type.String(), Type.Number()])
)
    .Decode((value) => {
        const num = typeof value === 'string' ? parseInt(value, 10) : value;
        if (isNaN(num) || num < 1 || num > 100) {
            throw new Error('limit must be a number between 1 and 100');
        }
        return num;
    })
    .Encode((value) => value));
