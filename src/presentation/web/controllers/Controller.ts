/**
 * Base controller class with typed dependencies.
 * All controllers should extend this class to ensure proper type inference.
 */
export abstract class Controller<TDeps extends object> {
    constructor(protected readonly deps: TDeps) {}
}
