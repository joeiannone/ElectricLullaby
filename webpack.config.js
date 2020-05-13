/**
 * @Author: Joe Iannone <josephiannone>
 * @Date:   2020-04-01T10:32:26-04:00
 * @Filename: webpack.config.js
 * @Last modified by:   josephiannone
 * @Last modified time: 2020-04-06T11:20:23-04:00
 */


const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './index.js',
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "webdist")
  },
  optimization: {
    splitChunks: {
      name: 'vendors',
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebPackPlugin({
      hash: true,
      template: "webpack.template.html",
      description: 'A polyphonic musical step sequencer built with javascript',
      filename: "index.html",
      chunks: ['index'],
    }),
    new MinifyPlugin(),
    new CopyPlugin([{ from: './icon.png' }]),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
}
