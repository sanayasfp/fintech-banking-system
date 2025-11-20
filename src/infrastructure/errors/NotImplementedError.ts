import { InfrastructureError } from "./InfrastructureError";

export class NotImplementedError extends InfrastructureError {
    constructor(methodName: string) {
        super(`Method ${methodName} is not implemented.`);
    }
}
