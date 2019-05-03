import Ajv from 'ajv';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ICommandResult, IKoaShellConfig } from './index';

const execPromise = promisify(exec);

const ajvValidate = new Ajv().compile({
    $schema: 'http://json-schema.org/draft-07/schema#',
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
    let exitCode = 0;
    let stdout: string;
    let stderr: string;
    try {
        ({ stdout, stderr } = await execPromise(command));
    } catch (err) {
        ({ code: exitCode, stdout, stderr } = err);
    }
    return { exitCode, stdout, stderr };
}
