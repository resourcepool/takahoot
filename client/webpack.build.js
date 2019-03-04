const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({template: 'src/index.html'}),
    new VueLoaderPlugin()
  ]
});
