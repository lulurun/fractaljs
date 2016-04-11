var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')
var string = require('rollup-plugin-string')
var postcss = require('rollup-plugin-postcss')
var npm = require('rollup-plugin-npm')

var plugins = [
  string({
    extensions: ['.html']
  }),
  postcss({}),
  npm({ jsnext: true }),
  babel({}),
];

rollup.rollup({
  entry: 'index.js',
  plugins: plugins,
}).then(function (bundle) {
  bundle.write({
    format: 'umd',
    dest: 'app.js',
    moduleName: "F",
    // globals: {
    //   jquery: "$",
    //   mustache: "Mustache",
    //   location: "location",
    // },
    sourceMap: true,
  });
}).catch(function(e) {
  console.log("Build error:", e);
});

