import type { CustomFormat } from '../utils/formatValidator';

export const dateFormat: CustomFormat = {
    name: 'date',
    validate: (value: string) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) return false;
        
        const date = new Date(value);
        return !isNaN(date.getTime());
    },
};

export const dateTimeFormat: CustomFormat = {
    name: 'date-time',
    validate: (value: string) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
    },
};
