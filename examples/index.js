var Mustache = require('mustache');

F.init(Mustache, {
  component: require.context('./component', true),
  template: require.context('./template', true),
});

F.build();
