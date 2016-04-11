import Component from './component';

var knownComponents = {};

function defineComponent(name) {
  var props = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var base = arguments[2];

  var c = base.extend(props || {});
  knownComponents[name] = c;
  return c;
}

function createComponent(name, $container) {
  if (name in knownComponents) {
    var Class = knownComponents[name];
    return new Class(name, $container);
  } else {
    console.error("component not found: " + name);
    return null;
  }
}

export default {
  component: api.component,
  build: function build($el, cb) {
    var Root = api.component("");
    var root = new Root("", $el);
    root.loadChildren(function () {
      if (cb) cb();
    });
  },
  config: function config(options) {}
};