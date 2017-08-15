const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: ['./src/index'],
    devServer: {
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            presets: [['env', { modules: false }], 'stage-0'],
                            plugins: ['transform-regenerator', 'transform-runtime']
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
              test: /\.css?$/,
              use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
              })
            },
            {
                test: /\.sass$/,
                use: ExtractTextPlugin.extract({
                  use: ['css-loader', 'sass-loader']
                })
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(),
        new HtmlWebpackIncludeAssetsPlugin({
          assets: ['https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.4/pixi.min.js'],
          append: false
        }),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackIncludeAssetsPlugin({
          assets: ['styles.css'],
          append: false
        }),
        new CopyWebpackPlugin([ { from: 'assets', to: 'assets' } ])
    ],
    output: { path: path.join(__dirname, 'dist'), filename: 'index.bundle.js' }
};
