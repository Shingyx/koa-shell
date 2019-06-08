import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Container from '@material-ui/core/Container';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { ICommand } from '../interfaces';

interface IProps extends WithStyles<typeof styles> {
}

interface IState {
    name: string;
    commands: ICommand[];
}

const styles = (theme: Theme) => {
    return createStyles({
        card: {
            marginTop: theme.spacing(2),
        },
    });
};

class App extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: 'Loading...',
            commands: [],
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

    public render() {
        const { classes } = this.props;
        return (
            <div>
                <Typography variant={'h1'} align={'center'} gutterBottom={true}>
                    {this.state.name}
                </Typography>
                <Container>
                    {this.state.commands.map((command) => (
                        <Card className={classes.card}>
                            <CardHeader title={command.id} subheader={command.description}/>
                        </Card>
                    ))}
                </Container>
            </div>
        );
    }
}

export default withStyles(styles)(App);
