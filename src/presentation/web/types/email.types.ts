import type { CustomFormat } from '../utils/formatValidator';

/**
 * Email format validator
 */
export const emailFormat: CustomFormat = {
    name: 'email',
    validate: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    },
};
