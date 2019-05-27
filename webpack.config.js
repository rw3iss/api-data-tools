const webpack = require('webpack');
const path = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.join(process.cwd(), 'build');

var config = {

    mode: 'development',

    entry: {
        index: [
            SRC_DIR + '/index.ts'
        ],
        generateMigrations:  path.resolve(SRC_DIR, 'scripts') + '/generateMigrations.ts'
    },

    target: 'node',

    output: {
        publicPath: '/',
        path: BUILD_DIR,
        filename: '[name].js',
        library: 'api-tools',
        libraryTarget: 'umd'
    },

    resolve: {
        mainFields: ['main', 'module'],

        extensions: ['.js', '.json', '.ts'],
	    alias: {
            src: path.resolve(__dirname, './src'),
            config: path.resolve(__dirname, './config')
	    }
    },

    module: {
        rules: [
            { 
                test: /\.(t|j)s?$/, 
                include: [
                    SRC_DIR
                ],
                exclude: /node_modules/,
                loader: ['ts-loader']
            }
        ],
        exprContextCritical: false // removes warning "Critical dependency: the request of a dependency is an expression"
    },

    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['build' ]
        }),
    ],

    devtool: '#eval-source-map',

    watch: true

};

module.exports = config;