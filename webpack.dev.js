const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const { spawn } = require('child_process');

// Config directories
const OUTPUT_DIR = path.resolve(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: OUTPUT_DIR,
    before() {
      spawn(
        'electron',
        ['.'],
        { shell: true, env: process.env, stdio: 'inherit' }
      )
        .on('close', code => process.exit(0))
        .on('error', spawnError => console.error(spawnError))
    }
  }
});
