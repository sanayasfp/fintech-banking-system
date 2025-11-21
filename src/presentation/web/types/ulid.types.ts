import { Type } from '@sinclair/typebox';
import { isValid } from 'ulidx';
import type { CustomFormat } from '../utils/formatValidator';

export const ulidFormat: CustomFormat = {
    name: 'ulid',
    validate: (value: string) => isValid(value),
};

export const UlidType = () => Type.String({
    minLength: 26,
    maxLength: 26,
    description: 'ULID identifier',
    format: 'ulid',
});
