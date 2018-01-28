const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: [
            './src/index.js'
        ]
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /.\elm$/,
                exclude: [/node_modules/, /elm-stuff/, /Stylesheet\.elm$/],
                use: [
                    'elm-hot-loader',
                    'elm-webpack-loader'
                ]
            },
            {
                test: /Stylesheets\.elm$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        'elm-css-webpack-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('style.css')
    ],
    devServer: {
        inline: true,
        stats: 'errors-only'
    }
};
