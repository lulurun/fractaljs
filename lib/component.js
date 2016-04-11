import Class from './class';
import config from './config';

var COMPONENT_ATTR = 'f-component';
var knownComponents = {};

//const COMPONENT_NAME_RE = /^#([0-9a-zA-Z_\-\/\.]+)/

export var Component = Class.extend({
  init: function init(name, $container) {
    this.name = name;
    this.$container = $container;
    this.complete = false;

    this.$ = this.$container.find.bind(this.$container);
    this.$container.on("destroyed", this.destroyed.bind(this));
  },
  getData: function getData(cb, param) {
    if (this.data && typeof this.data === 'function') this.data(cb, param);else cb(this.data || {});
  },
  render: function render(data, template, cb, param) {
    this.$container.html(config.render(template, data));
    cb();
  },
  rendered: function rendered(param) {},
  loadChildren: function loadChildren(cb, param) {
    build(this.$container, param, cb);
  },
  loaded: function loaded(cb, param) {
    cb();
  },
  destroyed: function destroyed(param) {},

  load: function load(param, cb) {
    var _this = this;

    param = param || {};
    console.time("Component." + this.name);
    this.complete = false;
    this.getData(function (data) {
      _this.render(data, _this.template, function () {
        _this.rendered(param);
        _this.loadChildren(function () {
          _this.complete = true;
          _this.loaded(function () {
            console.timeEnd("Component." + _this.name);
            _this.$container.removeAttr(COMPONENT_ATTR);
          }, param);
        }, param);
      }, param);
    }, param);
  }
});

export function build($root, param, cb) {
  var els = $root.find("[" + COMPONENT_ATTR + "]");
  if (!els.length) return cb();

  var complete = 0;
  els.each(function (i, el) {
    var $container = $(el);
    var name = $container.attr(COMPONENT_ATTR);
    var Class = knownComponents[name] || Component;
    var c = new Class(name, $container);
    c.load(param, function () {
      if (++complete === len) cb();
    });
  });
}

export function define(name, props, base) {
  var c = (base || Component).extend(props || {});
  knownComponents[name] = c;
  return c;
}