const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { ProvidePlugin } = require('webpack');

module.exports = {

    mode: 'production',
    devtool: 'eval',

    entry: `${path.resolve(__dirname, 'src')}/index.tsx`,

    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, `./dist/`),
        clean: true,
    },

    module: {
        rules: [
            // Use esbuild as a Babel alternative
            {
                enforce: 'pre',
                test: /\.m?[jt]sx?$/,
                loader: 'esbuild-loader',
                options: {
                    loader: 'tsx',
                    target: 'es2015',
                    sourcemap: false,
                },
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                            modules: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
        ],
    },

    optimization: {
        minimize: true,
        minimizer: [
            // Use esbuild to minify
            new ESBuildMinifyPlugin({
                sourcemap: false,
                target: 'es2015',
            }),
        ],
    },

    resolve: {
        extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.less', '.pcss', '.scss', '.sass', '.styl', '.css', '.wasm',],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs",
            title: 'My App',
            favicon: './src/assets/favicon.ico'
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
        }),
        new ProvidePlugin({
            h: ['preact', 'h'],
            Fragment: ['preact', 'Fragment']
        }),
    ],
};