F.init({
  render: Mustache.render,
  require: {
    component: require.context('./component', false),
    template: require.context('./template', false),
   },
});
F.build($(document));
