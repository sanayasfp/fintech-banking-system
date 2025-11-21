import { buildApp } from './web/app';

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

let server: Awaited<ReturnType<typeof buildApp>>;

const start = async () => {
    try {
        server = await buildApp();
        await server.listen({ port: server.config.PORT, host: server.config.HOST });

        server.log.info(`Server running at http://${server.config.HOST}:${server.config.PORT}`);
        server.log.info(`API Documentation at http://${server.config.HOST}:${server.config.PORT}/docs`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const shutdown = async (signal: string) => {
    if (server) {
        server.log.info(`${signal} received, shutting down gracefully...`);
        try {
            await server.close();
            server.log.info('Server closed');
            process.exit(0);
        } catch (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();
