import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Controller } from '../controllers/Controller';

type RequireAllKeys<T, K extends ReadonlyArray<keyof T>> =
    Exclude<keyof T, K[number]> extends never ? K : ['Error: Missing keys', Exclude<keyof T, K[number]>];

/**
 * Factory function to create a controller handler that resolves dependencies
 * from the request scope and instantiates the controller per-request.
 *
 * @param ControllerClass - The controller class to instantiate
 * @param methodName - The method name to call on the controller
 * @param dependencies - Array of dependency names to resolve from DI container (all keys required)
 * @returns A Fastify route handler function
 */
export function controllerFactory<
    TDeps extends object,
    TController extends Controller<TDeps>,
    TDepKeys extends ReadonlyArray<keyof TDeps & string>,
>(
    ControllerClass: new (deps: TDeps) => TController,
    methodName: keyof TController,
    dependencies: RequireAllKeys<TDeps, TDepKeys>,
) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        const { diScope } = request;

        const resolvedDeps = dependencies.reduce(
            (acc, dep) => {
                acc[dep as string] = diScope.resolve(dep as string);
                return acc;
            },
            {} as Record<string, unknown>,
        ) as TDeps;

        const controller = new ControllerClass(resolvedDeps);

        const method = controller[methodName];
        if (typeof method !== 'function') {
            throw new Error(`Method ${String(methodName)} not found on controller`);
        }

        const result = await (method as (req: FastifyRequest, rep: FastifyReply) => Promise<unknown>).call(
            controller,
            request,
            reply,
        );

        if (!reply.sent && result) {
            return result;
        }
    };
}
