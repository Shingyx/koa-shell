import Container from '@material-ui/core/Container';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ICommand, ICommandResult } from '../common/interfaces';
import CommandCard from './CommandCard';
import CommandResultDialog from './CommandResultDialog';

interface IProps extends WithStyles<typeof styles> {}

interface IState {
    name: string;
    commands: ICommand[];
    runningCommand: ICommand | undefined;
    commandResult: ICommandResult;
    showDialog: boolean;
}

function styles(theme: Theme) {
    return createStyles({
        title: {
            margin: theme.spacing(1),
            textAlign: 'center',
        },
    });
}

class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: 'Loading...',
            commands: [],
            runningCommand: undefined,
            commandResult: {
                success: true,
                output: '',
            },
            showDialog: false,
        };
    }

    public async componentDidMount(): Promise<void> {
        const response = await fetch('/api/config');
        if (!response.ok) {
            return alert('Failed to load commands');
        }
        const { name, commands } = await response.json();
        document.title = name;
        this.setState({ name, commands });
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div>
                <Typography className={classes.title} variant={'h2'} gutterBottom={true}>
                    {this.state.name}
                </Typography>
                <Container>
                    {this.state.commands.map((command) => (
                        <CommandCard
                            command={command}
                            disabled={this.state.runningCommand !== undefined}
                            running={this.state.runningCommand === command}
                            onClick={() => this.runCommand(command).catch(alert)}
                        />
                    ))}
                </Container>
                <CommandResultDialog
                    shouldOpen={this.state.showDialog}
                    commandResult={this.state.commandResult}
                    onClose={() => this.setState({ showDialog: false })}
                />
            </div>
        );
    }

    private async runCommand(command: ICommand): Promise<void> {
        this.setState({ runningCommand: command });
        try {
            const response = await fetch(`/api/commands/${command.id}`, { method: 'POST' });
            if (!response.ok) {
                throw new Error('Failed to start executing command');
            }
            const result: ICommandResult = await response.json();
            this.setState({ showDialog: true, commandResult: result });
        } finally {
            this.setState({ runningCommand: undefined });
        }
    }
}

export default withStyles(styles)(App);
