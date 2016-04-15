var fs = require('fs')
var rollup = require('rollup')
var babel = require('rollup-plugin-babel')

var plugins = [
  babel({}),
];

rollup.rollup({
  entry: 'src/index.js',
  plugins: plugins,
}).then(function (bundle) {
  ['umd', 'cjs'].forEach(v => {
    var file = 'dist/fractal.' + v + '.js';
    console.log(file);
    bundle.write({
      format: v,
      dest: file,
      moduleName: "F",
      sourceMap: true,
    });
  });
}).catch(function(e) {
  console.log("Build error:", e);
});

