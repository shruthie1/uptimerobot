const path = require('path');
const nodeExternals = require('webpack-node-externals');


/**@type {import('webpack').Configuration}*/
const config = {
    experiments: {
        topLevelAwait: true,
      },
    target: 'node', // vscode extensions run in webworker context for VS Code web 📖 -> https://webpack.js.org/configuration/target/#target
    entry: './index.js', // the entry point of this extension, 📖 -> https://webpack.js.org/configuration/entry-context/
    output: {
        path: path.resolve(__dirname, 'out'),
        globalObject: "this",
        filename: 'index.js',
        libraryTarget: 'commonjs',
        devtoolModuleFilenameTemplate: '../[resource-path]'
    },
    devtool: 'source-map',
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
    resolve: {
        mainFields: ['module', 'main'], // look for `browser` entry point in imported node modules
        extensions: ['.ts', '.js'],
        alias: {
        },
        fallback: {

        },
        modules: ['node_modules']
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            }
        ]
    }
};
module.exports = config;