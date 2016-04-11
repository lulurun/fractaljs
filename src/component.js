import Class from './class'
import Config from './config'

const COMPONENT_ATTR = 'f-component'
let knownComponents = {};

export const Component = Class.extend({
  init: function(name, $container) {
    this.name = name;
    this.$container = $container;
    this.complete = false;
    this.subTokens = {};
    this.$ = this.$container.find.bind(this.$container);
    this.$container.on("destroyed", this.destroyed.bind(this));
  },
  getData: function(cb, param) {
    if (this.data && typeof(this.data) === 'function') this.data(cb, param);
    else cb(this.data || {});
  },
  render: function(data, template, cb, param) {
    this.$container.html(Config.render(template, data));
    cb();
  },
  rendered: function(param){},
  loadChildren: function(cb, param) {
    build(this.$container, param, cb);
  },
  loaded: function(cb, param){
    cb();
  },
  destroyed: function(param){
    for (var topic in this.subTokens) Config.Pubsub.unsubscribe(this.subTokens[topic]);
  },
  // main entry
  load: function(param, cb) {
    param = param || {};
    console.time("Component." + this.name);
    this.complete = false;
    this.getData(data => {
      this.render(data, this.template, () => {
        this.rendered(param);
        this.loadChildren(() => {
          this.complete = true;
          this.loaded(() => {
            console.timeEnd("Component." + this.name);
            this.$container.removeAttr(COMPONENT_ATTR);
          }, param)
        }, param)
      }, param)
    }, param)
  },
  // pubsub
  publish: function(topic, data) {
    Config.Pubsub.publish(topic, data, this);
  },
  subscribe: function(topic, cb) {
    this.subTokens[topic] = Config.Pubsub.subscribe(topic, cb, this);
  },
});

export function build($root, param, cb){
  let els = $root.find("[" + COMPONENT_ATTR + "]");
  if (!els.length) return cb();

  let complete = 0;
  els.each((i, el) => {
    let $container = $(el);
    let name = $container.attr(COMPONENT_ATTR);
    let Class = knownComponents[name] || Component;
    let c = new Class(name, $container);
    c.load(param, () => {
      if (++complete === len) cb();
    });
  });
}

export function define(name, props, base) {
  var c = (base || Component).extend(props || {});
  knownComponents[name] = c;
  return c;
}

