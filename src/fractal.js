import Component from './component'



export default {
  component: api.component,
  build: function($el, cb){
    var Root = api.component("");
    var root = new Root("", $el);
    root.loadChildren(() => {
      if (cb) cb();
    });
  },
  config: function(options) {
  },
}

