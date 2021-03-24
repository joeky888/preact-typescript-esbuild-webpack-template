import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import * as webpack from 'webpack';
import 'webpack-dev-server';

const config: webpack.Configuration = {

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
            {
                test: /\.(png|jpe?g|gif|jp2|webp|glsl)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                },
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
    ],
};

export default config;