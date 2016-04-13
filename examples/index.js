var F = require('../dist/fractal.umd.js');
//require('./component/main.js')
//require('./component/list.js')
F.init({
  render: Mustache.render,
  require: {
    component: require.context('./component', false, /^\.\/.*\.js$/),
    template: require.context('./template', false, /^\.\/.*\.html$/),
   },
});
F.build($(document));
