var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './index',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      //{ test: /\.js$/, loader: 'babel' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loader: "style!css" },
    ]
  },
  babel: {
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devtool: 'source-map'
}

