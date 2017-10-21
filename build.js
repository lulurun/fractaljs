var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')

rollup.rollup({
  input: 'src/index.js',
  plugins: [
    babel({}),
  ],
}).then(function (bundle) {
  var file = 'dist/fractal.js';
  bundle.write({
    format: 'umd',
    name: 'F',
    file: file,
    sourcemap: true,
  });
}).catch(function(e) {
  console.log("Build error:", e);
});
