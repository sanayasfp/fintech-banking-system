import type Ajv from 'ajv';

export type FormatValidator = (value: string) => boolean;

export interface CustomFormat {
    name: string;
    validate: FormatValidator;
}

export function registerCustomFormats(ajv: Ajv, formats: CustomFormat[]): void {
    for (const format of formats) {
        ajv.addFormat(format.name, {
            validate: format.validate,
        });
    }
}
