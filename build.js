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
    bundle.write({
      format: v,
      dest: 'dist/fractal.' + v + '.js',
      moduleName: "F",
      sourceMap: true,
    });
  });
}).catch(function(e) {
  console.log("Build error:", e);
});

