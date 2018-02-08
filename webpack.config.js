'use strict';
const path = require('path');
const webpack = require('webpack');
module.exports =
    {
        entry:
        {
            main: './app/src/main.ts'
        },
        output:
        {
            path: path.resolve(__dirname + '/app'),
            filename: '[name].bundle.js'
        },
        module:
        {
            loaders:
            [
                {
                    test: /\.ts$/,
                    loaders: ['awesome-typescript-loader', 'angular2-template-loader?keepUrl=true'],
                    exclude: [/\.(spec|e2e)\.ts$/]
                },
                {
                    test: /\.html$/,
                    use: 'raw-loader'
                },
                {
                    test: /\.css$/,
                    loaders: ['style-loader', 'css-loader']
                },
                {
                    test: /\.(jpe?g|png|gif|svg)$/i,
                    use: [
                        'raw-loader',
                        'img-loader'
                    ]
                }
            ]
        },
        plugins:
        [
            new webpack.ProgressPlugin(),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core/,
                path.join(__dirname, './src'),
                {}
            )
        ],
        resolve:
        {
            extensions: ['.ts', '.js']
        }
    };