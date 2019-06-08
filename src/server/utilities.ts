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

export function validateConfig(config: IKoaShellConfig): void {
    if (!ajvValidate(config)) {
        throw new Error('Config is not valid!');
    }
    const commandIds = new Set<string>();
    for (const { id } of config.commands) {
        // TODO validate IDs based on RFC for path names
        if (commandIds.has(id)) {
            throw new Error('All commands do not have unique IDs!');
        }
        commandIds.add(id);
    }
}

export async function executeCommand(command: string): Promise<ICommandResult> {
    let success = false;
    let output = '';
    await new Promise((resolve) => {
        const child = spawn(command, { shell: true });
        child.stdout.on('data', (data) => (output += data));
        child.stderr.on('data', (data) => (output += data));
        child.on('close', (code) => {
            success = code === 0;
            resolve();
        });
    });
    output = output.trim();
    return { success, output };
}
