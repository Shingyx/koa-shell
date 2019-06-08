import { IKoaShellConfig } from '../../src/common/interfaces';
import { validateConfig } from '../../src/server/utilities';

describe('validateConfig', () => {
    test('valid config does not throw', () => {
        const config: IKoaShellConfig = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        validateConfig(config);
    });

    test('supports multiple commands', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [
                { id: 'command1', description: 'first command', script: 'echo hello world' },
                { id: 'command2', description: 'second command', script: 'echo goodbye world' },
            ],
        };
        validateConfig(config);
    });

    test('throw when name is missing', () => {
        const config = {
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when name is not a string', () => {
        const config = {
            name: 23,
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when name is empty', () => {
        const config = {
            name: '',
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when port is missing', () => {
        const config = {
            name: 'name',
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when port is not a number', () => {
        const config = {
            name: 'name',
            port: 'hello world',
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when port is negative', () => {
        const config = {
            name: 'name',
            port: -1,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when port is too large', () => {
        const config = {
            name: 'name',
            port: 65536,
            commands: [{ id: 'id', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when commands are missing', () => {
        const config = {
            name: 'name',
            port: 9001,
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when commands are empty', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when command id is missing', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command id is not a string', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 123, description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command id is empty', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: '', description: 'description', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when command description is missing', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command description is not a string', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: 123, script: 'echo hello world' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command description is empty', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: '', script: 'echo hello world' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when command script is missing', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: 'description' }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command script is not a string', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: 123 }],
        };
        expect(() => validateConfig(config as any)).toThrow();
    });

    test('throw when command script is empty', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [{ id: 'id', description: 'description', script: '' }],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    test('throw when an id is already used by another command', () => {
        const config = {
            name: 'name',
            port: 9001,
            commands: [
                { id: 'command1', description: 'first command', script: 'echo hello world' },
                { id: 'command1', description: 'dupe command', script: 'echo hello world' },
            ],
        };
        expect(() => validateConfig(config)).toThrow();
    });

    describe('command id validation', () => {
        test('allow id consisting of entire alphabet and all digits', () => {
            const config: IKoaShellConfig = {
                name: 'name',
                port: 9001,
                commands: [
                    {
                        id: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
                        description: 'description',
                        script: 'echo me',
                    },
                ],
            };
            validateConfig(config);
        });

        test('allow hyphens and underscores in command ids', () => {
            const config: IKoaShellConfig = {
                name: 'name',
                port: 9001,
                commands: [
                    { id: 'id-1', description: 'description', script: 'echo hello 1' },
                    { id: 'id_2', description: 'description', script: 'echo hello 2' },
                ],
            };
            validateConfig(config);
        });

        for (const char of [' ', '!', '@', ',', '.', '&', '?', '=']) {
            test(`throw when command contains "${char}"`, () => {
                const config = {
                    name: 'name',
                    port: 9001,
                    commands: [
                        {
                            id: `hi${char}world`,
                            description: 'description',
                            script: 'echo hi world',
                        },
                    ],
                };
                expect(() => validateConfig(config)).toThrow();
            });
        }
    });
});
