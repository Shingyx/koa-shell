export interface IKoaShellConfig {
    name: string;
    port: number;
    commands: ICommand[];
}

export interface ICommand {
    id: string;
    description: string;
    script: string;
}

export interface ICommandResult {
    success: boolean;
    output: string;
}
