const path = require('path');

module.exports = {
  mode: 'production',
  entry: './main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../build'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../build'),
    },
    compress: false,
    port: 8000,
  }
};