import Ajv from 'ajv';
import { spawn } from 'child_process';
import { ICommandResult, IKoaShellConfig } from '../common/interfaces';

const ajvValidate = new Ajv().compile({
    type: 'object',
    required: ['name', 'port', 'commands'],
    properties: {
        name: { type: 'string', minLength: 1 },
        port: { type: 'integer', minimum: 0, maximum: 65535 },
        commands: {
            type: 'array',
            items: {
                type: 'object',
                required: ['id', 'description', 'script'],
                properties: {
                    id: { type: 'string', minLength: 1 },
                    description: { type: 'string', minLength: 1 },
                    script: { type: 'string', minLength: 1 },
                },
            },
            minItems: 1,
        },
    },
});
const idRegex = /^[a-z0-9\-_]+$/i;

export function validateConfig(config: IKoaShellConfig): void {
    if (!ajvValidate(config)) {
        throw new Error('Config is not valid!');
    }
    const commandIds = new Set<string>();
    for (const { id } of config.commands) {
        if (!idRegex.test(id)) {
            throw new Error(
                'Command IDs must only contain alphanumeric characters, hyphens, and underscores!',
            );
        }
        if (commandIds.has(id)) {
            throw new Error('All commands do not have unique IDs!');
        }
        commandIds.add(id);
    }
}

export function executeCommand(command: string): Promise<ICommandResult> {
    return new Promise((resolve) => {
        let output = '';
        const child = spawn(command, { shell: true });
        child.stdout.on('data', (data) => (output += data));
        child.stderr.on('data', (data) => (output += data));
        child.on('close', (code) => {
            resolve({
                success: code === 0,
                output: output.trim(),
            });
        });
    });
}
