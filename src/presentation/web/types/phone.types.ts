import type { CustomFormat } from '../utils/formatValidator';

export const phoneFormat: CustomFormat = {
    name: 'phone',
    validate: (value: string) => {
        const cleaned = value.replace(/[\s\-()]/g, '');
        const phoneRegex = /^\+[1-9]\d{9,14}$/;

        return phoneRegex.test(cleaned);
    },
};
