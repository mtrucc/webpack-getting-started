const path = require('path');

module.exports = {
  // devtool: 'source-map',
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimize: false,
  },
};
