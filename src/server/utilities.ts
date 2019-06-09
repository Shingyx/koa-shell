import Ajv from 'ajv';
import { spawn } from 'child_process';
import { ICommandResult, IKoaShellConfig } from '../common/interfaces';
import schema from './config.schema.json';

const ajvValidate = new Ajv().compile(schema);

export function validateConfig(config: IKoaShellConfig): void {
    if (!ajvValidate(config)) {
        throw new Error('Config is not valid!');
    }
    const commandIds = new Set<string>();
    for (const command of config.commands) {
        const id = command.id.toLowerCase();
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
