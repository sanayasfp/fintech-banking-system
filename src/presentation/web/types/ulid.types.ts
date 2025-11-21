import { Type } from '@sinclair/typebox';
import { isValid } from 'ulidx';
import type { CustomFormat } from '../utils/formatValidator';

/**
 * ULID custom format definition for AJV validation
 */
export const ulidFormat: CustomFormat = {
    name: 'ulid',
    validate: (value: string) => isValid(value),
};

/**
 * TypeBox type definition for ULID
 * Returns a string type with ULID format validation
 */
export const UlidType = () => Type.String({
    minLength: 26,
    maxLength: 26,
    description: 'ULID identifier',
    format: 'ulid',
});
