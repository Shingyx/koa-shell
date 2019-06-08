import blue from '@material-ui/core/colors/blue';
import CssBaseline from '@material-ui/core/CssBaseline';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import App from './App';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        type: 'dark',
    },
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <React.Fragment>
            <CssBaseline />
            <App />
        </React.Fragment>
    </MuiThemeProvider>,
    document.getElementById('root'),
);
