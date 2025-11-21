import type { CustomFormat } from '../utils/formatValidator';

/**
 * Phone format validator
 * Accepts: +2255512345678 +225 55 98 74 7894 +(225)5598747894 +225-5598747894
 */
export const phoneFormat: CustomFormat = {
    name: 'phone',
    validate: (value: string) => {
        const cleaned = value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^\+[1-9]\d{9,14}$/;

        return phoneRegex.test(cleaned);
    },
};
