const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')

module.exports = {
    mode: 'production',
    target: 'web',
    entry: {
        contentScript: './src/content/index.ts',
        background: './src/background/index.ts',
        react: './src/react/index.tsx'
    },
    output:{
        path: path.resolve('dist'),
        filename: '[name].js',
        clean: true
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('manifest.json'),
                to: path.resolve('dist')
            }]
        })
    ],
    module: {
        rules: [
            {
                test: /.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react',{'runtime': 'automatic'}],
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.svg$/,
                type: 'asset/inline'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx']
    }
}