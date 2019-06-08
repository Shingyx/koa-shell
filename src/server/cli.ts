#!/usr/bin/env node
import { readFileSync } from 'fs';
import { KoaShellServer } from './koa-shell-server';

const args = process.argv.slice(2);
const usageStr = 'Usage: koa-shell [config.json path (default: config.json)]';

if (args.length > 1 || args[0] === '-h' || args[0] === '--help') {
    console.log(usageStr);
    process.exit(0);
}

const configPath = args[0] || 'config.json';

try {
    const fileContents = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(fileContents);
    const server = new KoaShellServer(config);
    server.start();
} catch (e) {
    console.error(`Error: ${e.message.trim()}`);
    console.log(usageStr);
    process.exit(1);
}
