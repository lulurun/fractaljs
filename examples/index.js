
require('./app/main.js')
require('./app/list.js')
F.init({
  render: Mustache.render,
});
F.build($(document));
