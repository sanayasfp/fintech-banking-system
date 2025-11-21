export abstract class Controller<TDeps extends object> {
    constructor(protected readonly deps: TDeps) {}
}
