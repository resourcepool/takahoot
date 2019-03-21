const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Config directories

module.exports = {
  watch: false,
  entry: './src/index.js',
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
    new HtmlWebpackPlugin({template: './src/index.html'}),
    new VueLoaderPlugin(),
    new CopyWebpackPlugin([
      { from: './package.json', to: '.' },
      { from: './main.js', to: '.' },
      { from: './bridge', to: './bridge' },
      { from: './common', to: './common' }
    ]),
  ],
  resolve: {
    extensions: ['.js', '.vue', '.scss', '.json'],
    alias: {
      '@/app': path.resolve(__dirname, 'src/app/'),
      '@/target-service': path.resolve(__dirname, 'src/target-service/'),
      '@/kahoot-service': path.resolve(__dirname, 'src/kahoot-service/'),
      '@/assets': path.resolve(__dirname, 'src/assets/'),
      '@/common': path.resolve(__dirname, 'common/'),
      '@/shared': path.resolve(__dirname, 'src/shared/'),
      vue: 'vue/dist/vue.js'
    }
  }
};
