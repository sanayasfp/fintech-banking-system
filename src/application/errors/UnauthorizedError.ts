export class UnauthorizedError extends Error {
    constructor(message?: string) {
        super(message || 'Unauthorized');
        this.name = this.constructor.name;
    }
}
