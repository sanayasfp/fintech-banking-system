import type { CustomFormat } from '../utils/formatValidator';

/**
 * Date format validator (YYYY-MM-DD)
 */
export const dateFormat: CustomFormat = {
    name: 'date',
    validate: (value: string) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) return false;
        
        const date = new Date(value);
        return !isNaN(date.getTime());
    },
};

/**
 * DateTime format validator (ISO 8601)
 */
export const dateTimeFormat: CustomFormat = {
    name: 'date-time',
    validate: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
    },
};
