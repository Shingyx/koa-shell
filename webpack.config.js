const path = require('path');
const config = require('./config.json');

module.exports = {
    mode: 'production',

    entry: ['./src/client/index.tsx'],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'public', 'dist'),
        publicPath: '/dist/',
    },
    performance: {
        hints: false,
    },

    devServer: {
        contentBase: path.join(__dirname, 'public'),
        proxy: {
            '/api': {
                target: `http://localhost:${config.port}`,
            },
        },
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    configFile: 'src/client/tsconfig.json',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'file-loader',
            },
        ],
    },
};
