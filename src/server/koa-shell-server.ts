import { Server } from 'http';
import Koa from 'koa';
import Router from 'koa-router';
import serve from 'koa-static';
import path from 'path';
import { ICommand, IKoaShellConfig } from '../common/interfaces';
import { executeCommand, validateConfig } from './utilities';

export class KoaShellServer {
    private readonly app: Koa;
    private globalRequestId: number;
    private server?: Server;

    constructor(private readonly config: IKoaShellConfig) {
        validateConfig(config);

        this.app = new Koa();
        this.globalRequestId = 0;

        this.app.use(async (ctx, next) => {
            const requestId = ++this.globalRequestId % Number.MAX_SAFE_INTEGER;
            console.log(
                `received request - ${JSON.stringify({
                    requestId,
                    time: new Date().toISOString(),
                    path: ctx.path,
                })}`,
            );
            try {
                await next();
            } catch (err) {
                console.error(err);
                ctx.throw(500);
            } finally {
                console.log(
                    `completed request - ${JSON.stringify({
                        requestId,
                        time: new Date().toISOString(),
                        status: ctx.status,
                        body: ctx.body || null,
                    })}`,
                );
            }
        });

        const publicPath = path.join(__dirname, '..', '..', 'public');
        this.app.use(serve(publicPath));

        const router = new Router();

        router.get('/api/config', async (ctx) => {
            ctx.body = config;
        });

        const commandsRouter = makeCommandsRouter(config.commands);
        router.use('/api/commands', commandsRouter.routes(), commandsRouter.allowedMethods());

        this.app.use(router.routes());
        this.app.use(router.allowedMethods());
    }

    public start(): void {
        if (this.server) {
            console.warn('Already started!');
            return;
        }
        this.server = this.app.listen(this.config.port);
        console.log(`Listening on port ${this.config.port}`);
    }

    public async stop(): Promise<void> {
        if (!this.server) {
            console.warn('Already stopped!');
            return;
        }
        const server = this.server;
        this.server = undefined;
        await new Promise((resolve) => server.close(resolve));
        console.log('Server stopped');
    }
}

function makeCommandsRouter(commands: ICommand[]): Router {
    const router = new Router();

    // get details for all commands
    router.get('/', async (ctx) => {
        ctx.body = commands;
    });

    for (const command of commands) {
        // get details for command
        router.get(`/${command.id}`, async (ctx) => {
            ctx.body = command;
        });
        // execute command
        router.post(`/${command.id}`, async (ctx) => {
            ctx.body = await executeCommand(command.script);
        });
    }

    return router;
}
