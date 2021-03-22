const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = {
    // Source: https://github.com/preactjs/preact-cli/blob/master/packages/cli/lib/lib/webpack/webpack-base-config.js
    // Source: https://github.com/preactjs/preact-cli/wiki/Config-Recipes
    // Source: https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module

    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 8888,
        hot: true
    },

    entry: `${path.resolve(__dirname, 'src')}/index.tsx`,

    output: {
        filename: '[name].[chunkhash].js',
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
                    sourcemap: true,
                },
            },
            {
                // User styles
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-modules-typescript-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },

    optimization: {
        minimize: false,
        minimizer: [
            // Use esbuild to minify
            new ESBuildMinifyPlugin({
                sourcemap: true,
                target: 'es2015',
            }),
        ],
    },

    resolve: {
        extensions: ['.mjs','.js','.jsx','.ts','.tsx','.json','.less','.pcss','.scss','.sass','.styl','.css','.wasm',],
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.ejs",
            title: 'My App',
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            chunkFilename: '[id].[chunkhash].css',
        }),
    ],
};