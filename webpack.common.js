const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');
const BRIDGE_DIR = path.resolve(__dirname, 'bridge');

module.exports = {
  watch: false,
  entry: SRC_DIR + '/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        // this will apply to both plain `.scss` files
        // AND `<style lang="scss">` blocks in `.vue` files
        test: /\.(scss|css)$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
      }
    ]
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({template: 'src/index.html'}),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: SRC_DIR + '/common/Logger.js', to: BRIDGE_DIR + '/Logger.js' },
      // { from: SRC_DIR + '/target-service/ipc-actions.js', to: BRIDGE_DIR + '/ipc-actions.js' },
    ]),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.json'],
    alias: {
      '@/app': path.resolve(__dirname, 'src/app/'),
      '@/target-service': path.resolve(__dirname, 'src/target-service/'),
      '@/assets': path.resolve(__dirname, 'src/assets/'),
      '@/common': path.resolve(__dirname, 'src/common/'),
      vue: 'vue/dist/vue.js'
    }
  }
};
