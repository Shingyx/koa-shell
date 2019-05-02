import { IKoaShellConfig } from '../index';
import { validateConfig } from '../utilities';

describe('validateConfig', () => {
    test('valid config does not throw', () => {
        const config: IKoaShellConfig = {
            name: 'name',
            port: 9001,
            commands: [
                {
                    id: 'id',
                    description: 'description',
                    script: 'echo hello world',
                },
            ],
        };

        validateConfig(config);
    });
});
