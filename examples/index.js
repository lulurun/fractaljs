var $ = require('jquery');
var Mustache = require('mustache');
var F = require('../dist/fractal.cjs.js');

F.init({
  $: $,
  render: Mustache.render,
  require: {
    component: require.context('./component', true),
    template: require.context('./template', true),
   },
});
F.build($(document));


