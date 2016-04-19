var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['./index.umd.js'],
  output: {
    filename: 'bundle.umd.js',
    publicPath: '/examples/',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {compact: false},
        exclude: /node_modules/,
      },
      { test: /\.html$/, loader: 'html' },
      { test: /\.css$/, loader: "style!css" },
    ]
  },
  babel: {},
  resolve: {
    root: [ path.join(__dirname, "bower_components") ],
  },
  devtool: 'source-map'
}

