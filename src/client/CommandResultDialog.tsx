import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import { ICommandResult } from '../common/interfaces';

interface IProps {
    shouldOpen: boolean;
    commandResult: ICommandResult;
    onClose(): void;
}

class CommandResultDialog extends React.Component<IProps, {}> {
    public render(): JSX.Element {
        const { shouldOpen, commandResult, onClose } = this.props;
        return (
            <Dialog maxWidth={'sm'} fullWidth={true} open={shouldOpen} onClose={onClose}>
                <DialogTitle>
                    {commandResult.success ? 'Command Succeeded' : 'Command Failed'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {commandResult.output || 'No output given'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color={'primary'} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CommandResultDialog;
