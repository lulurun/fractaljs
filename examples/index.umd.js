var $ = require('jquery');
var Mustache = require('mustache');

F.init({
  $: $,
  render: Mustache.render,
  require: {
    component: require.context('./component', true),
    template: require.context('./template', true),
   },
});
F.build($(document));


