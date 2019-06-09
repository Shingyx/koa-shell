import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Fab from '@material-ui/core/Fab';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import PlayArrow from '@material-ui/icons/PlayArrow';
import React from 'react';
import { ICommand } from '../common/interfaces';

interface IProps extends WithStyles<typeof styles> {
    command: ICommand;
    disabled: boolean;
    running: boolean;
    onClick(): void;
}

function styles(theme: Theme) {
    return createStyles({
        card: {
            display: 'flex',
            marginTop: theme.spacing(1),
            marginBottom: theme.spacing(1),
            alignItems: 'center',
        },
        cardHeader: {
            flex: '1 1 auto',
        },
        fabWrapper: {
            marginRight: theme.spacing(2),
        },
        fabIcon: {
            height: 32,
            width: 32,
        },
        fabProgress: {
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
        },
    });
}

class CommandCard extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const { classes, command, disabled, running, onClick } = this.props;
        return (
            <Card className={classes.card}>
                <CardHeader
                    className={classes.cardHeader}
                    title={command.id}
                    subheader={command.description}
                />
                <div className={classes.fabWrapper}>
                    <Fab color={'primary'} disabled={disabled} onClick={onClick}>
                        <PlayArrow className={classes.fabIcon} />
                        {running && <CircularProgress className={classes.fabProgress} size={68} />}
                    </Fab>
                </div>
            </Card>
        );
    }
}

export default withStyles(styles)(CommandCard);
