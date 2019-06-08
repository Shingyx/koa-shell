import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import PlayArrow from '@material-ui/icons/PlayArrow';
import React from 'react';
import { ICommand, ICommandResult } from '../interfaces';

interface IProps extends WithStyles<typeof styles> {}

interface IState {
    name: string;
    commands: ICommand[];
    loadingIndex: number;
}

function styles(theme: Theme) {
    return createStyles({
        title: {
            margin: theme.spacing(1),
            textAlign: 'center',
        },
        card: {
            display: 'flex',
            marginTop: theme.spacing(2),
            alignItems: 'center',
        },
        cardHeader: {
            flex: '1 0 auto',
        },
        fabWrapper: {
            marginRight: theme.spacing(2),
        },
        fabProgress: {
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
        },
        iconButton: {
            margin: theme.spacing(1),
        },
        playIcon: {
            height: 32,
            width: 32,
        },
    });
}

class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: 'Loading...',
            commands: [],
            loadingIndex: -1,
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
                <Typography className={classes.title} variant={'h2'}>
                    {this.state.name}
                </Typography>
                <Container>
                    {this.state.commands.map((command, index) => this.commandCard(command, index))}
                </Container>
            </div>
        );
    }

    private commandCard(command: ICommand, index: number): JSX.Element {
        const { classes } = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader
                    className={classes.cardHeader}
                    title={command.id}
                    subheader={command.description}
                />
                <div className={classes.fabWrapper}>
                    <Fab
                        color={'primary'}
                        disabled={this.state.loadingIndex >= 0}
                        onClick={() => this.onCommandClick(command, index)}
                    >
                        <PlayArrow className={classes.playIcon} />
                        {this.state.loadingIndex === index && (
                            <CircularProgress className={classes.fabProgress} size={68} />
                        )}
                    </Fab>
                </div>
            </Card>
        );
    }

    private onCommandClick(command: ICommand, index: number): void {
        this.setState({ loadingIndex: index });
        this.executeCommand(command)
            .finally(() => this.setState({ loadingIndex: -1 }))
            .catch(alert);
    }

    private async executeCommand(command: ICommand): Promise<void> {
        const response = await fetch(`/api/commands/${command.id}`, { method: 'POST' });
        if (!response.ok) {
            throw new Error('Failed to start executing command');
        }
        const result: ICommandResult = await response.json();
        console.log(result);
    }
}

export default withStyles(styles)(App);
