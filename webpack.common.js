const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Config directories
const SRC_DIR = path.resolve(__dirname, 'src');

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
      },
      {
        test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
        resolve: {
          aliasFields: ['main']
        }
      },
      {
        test: /\.worker\.js$/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  target: 'electron-renderer',
  plugins: [
    new HtmlWebpackPlugin({template: 'src/index.html'}),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.vue', '.scss'],
    alias: {
      '@/app': path.resolve(__dirname, 'src/app/'),
      '@/target-business': path.resolve(__dirname, 'src/target-business/'),
      '@/assets': path.resolve(__dirname, 'src/assets/'),
      vue: 'vue/dist/vue.js'
    }
  },
  externals: [
    'child_process'
  ]
};
