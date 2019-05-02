import { readFileSync } from 'fs';
import { KoaShellServer } from './index';

if (process.argv.length !== 3) {
    console.log('Usage: koa-shell <config-json>');
    process.exit(0);
}

try {
    const configPath = process.argv[2];
    const fileContents = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(fileContents);
    const server = new KoaShellServer(config);
    server.start();
} catch (e) {
    console.error(`Error: ${e.message.trim()}`);
    process.exit(1);
}
