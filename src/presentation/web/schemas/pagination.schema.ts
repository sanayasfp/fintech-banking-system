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
