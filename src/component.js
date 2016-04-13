import Class from './class'
import Config from './config'

const COMPONENT_ATTR = 'f-component'
let knownComponents = {};
let knownTemplates = {};

export const Component = Class.extend({
  init: function(name, $container) {
    this.name = name;
    this.$container = $container;
    this.complete = false;
    this.subTokens = {};
    this.$ = this.$container.find.bind(this.$container);
    this.$container.on('destroyed', this.destroyed.bind(this));

    if (!this.template) {
      this.template = getTemplate(this.templateName || this.name);
    }
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
    console.time('Component.' + this.name);
    this.complete = false;
    this.getData(data => {
      this.render(data, this.template, () => {
        this.rendered(param);
        this.loadChildren(() => {
          this.complete = true;
          this.loaded(() => {
            console.timeEnd('Component.' + this.name);
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
  let els = $root.find('[' + COMPONENT_ATTR + ']');
  if (!els.length) return cb();

  let complete = 0;
  els.each((i, el) => {
    let $container = $(el);
    let name = $container.attr(COMPONENT_ATTR);
    let Class = getComponent(name);
    let c = new Class(name, $container);
    c.load(param, () => {
      if (++complete === len) cb();
    });
  });
}

function getTemplate(name) {
  if (name in knownTemplates){
    return knownTemplates[name];
  } else {
    let template = Config.require.template("./" + name + ".html");
    if (template) {
      if (Config.compile) {
        template = Config.compile(template);
      }
      knownTemplates[name] = template;
      return template;
    }
  }
  console.error("Template not found: " + name);
  return "";
}

function getComponent(name) {
  if (name in knownComponents) {
    return knownComponents[name];
  } else {
    let Class = Config.require.component("./" + name);
    if (Class) {
      knownComponents[name] = Class;
      return Class;
    }
  }
  console.error("Component not found: " + name);
  return Component;
}

export function define(name, props, base) {
  var c = (base || Component).extend(props || {});
  knownComponents[name] = c;
  return c;
}

