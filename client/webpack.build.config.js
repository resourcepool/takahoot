const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');

module.exports = {
  watch: false,
  mode: 'production',
  entry: SRC_DIR + '/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        include: SRC_DIR
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: SRC_DIR
      },
      {
        // this will apply to both plain `.scss` files
        // AND `<style lang="scss">` blocks in `.vue` files
        test: /\.(scss|css)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
        include: SRC_DIR
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ],
        include: SRC_DIR
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ],
        include: SRC_DIR
      }
    ]
  },
  target: 'electron-renderer',
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin(),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', 'vue'],
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
};
