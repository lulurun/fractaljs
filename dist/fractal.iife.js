var F = (function () {
  'use strict';

  /* Simple JavaScript Inheritance
   * By John Resig http://ejohn.org/
   * MIT Licensed.
   */
  // Inspired by base2 and Prototype
  var initializing = false;
  var fnTest = /xyz/.test(function () {
    xyz;
  }) ? /\b_super\b/ : /.*/;
  var Class = function Class() {};
  Class.extend = function (prop) {
    var _super = this.prototype;
    var callee = this.extend;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function (name, fn) {
        return function () {
          var tmp = this._super;
          this._super = _super[name];

          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      }(name, prop[name]) : prop[name];
    }

    var Class = function Class() {
      if (!initializing && this.init) this.init.apply(this, arguments);
    };

    Class.prototype = prototype;
    Class.prototype.constructor = Class;

    Class.extend = this.extend;
    return Class;
  };

  var topics = {};
  var seq = 0;
  var Pubsub = {
    publish: function publish(topic, data, publisher) {
      var subscribers = topics[topic];
      for (var i in subscribers) {
        subscribers[i].cb(topic, data, publisher);
      }
    },
    subscribe: function subscribe(topic, cb, subscriber) {
      console.debug("subscribe", topic);
      if (!topics[topic]) topics[topic] = [];
      var token = ++seq;
      topics[topic].push({
        token: token,
        subscriber: subscriber,
        cb: cb
      });
      return token;
    },
    unsubscribe: function unsubscribe(topic, token) {
      console.debug("unsubscribe", topic);
      if (!(topic in topics)) return;
      var subscribers = topics[topic];
      for (var i in subscribers) {
        if (subscribers[i].token === token) {
          subscribers.splice(i, 1);
          break;
        }
      }
      if (subscribers.length === 0) delete topics[topic];
    },
    getSubscribers: function getSubscribers(topic) {
      if (!(topic in topics)) return [];
      return topics[topic].map(function (v) {
        return v.subscriber;
      });
    }
  };

  var Config = {
    compile: function compile(text) {
      return text;
    },
    render: function render(template, data) {},
    Pubsub: Pubsub,
    require: {
      // component: require.context('./component', false, /^\.\/.*\.js$/),
      // template: require.context('./template', false, /^\.\/.*\.html$/),
    }
  };

  var COMPONENT_ATTR = 'f-component';
  var knownComponents = {};
  var knownTemplates = {};

  var Component = Class.extend({
    init: function init(name, $container) {
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
    getData: function getData(cb, param) {
      if (this.data && typeof this.data === 'function') this.data(cb, param);else cb(this.data || {});
    },
    render: function render(data, template, cb, param) {
      this.$container.html(Config.render(template, data));
      cb();
    },
    rendered: function rendered(param) {},
    loadChildren: function loadChildren(cb, param) {
      build(this.$container, param, cb);
    },
    loaded: function loaded(cb, param) {
      cb();
    },
    destroyed: function destroyed(param) {
      for (var topic in this.subTokens) {
        Config.Pubsub.unsubscribe(this.subTokens[topic]);
      }
    },
    // main entry
    load: function load(param, cb) {
      var _this = this;

      param = param || {};
      console.time('Component.' + this.name);
      this.complete = false;
      this.getData(function (data) {
        _this.render(data, _this.template, function () {
          _this.rendered(param);
          _this.loadChildren(function () {
            _this.complete = true;
            _this.loaded(function () {
              console.timeEnd('Component.' + _this.name);
              _this.$container.removeAttr(COMPONENT_ATTR);
            }, param);
          }, param);
        }, param);
      }, param);
    },
    // pubsub
    publish: function publish(topic, data) {
      Config.Pubsub.publish(topic, data, this);
    },
    subscribe: function subscribe(topic, cb) {
      this.subTokens[topic] = Config.Pubsub.subscribe(topic, cb, this);
    }
  });

  function build($root, param, cb) {
    var els = $root.find('[' + COMPONENT_ATTR + ']');
    if (!els.length) return cb();

    var complete = 0;
    els.each(function (i, el) {
      var $container = $(el);
      var name = $container.attr(COMPONENT_ATTR);
      var Class = getComponent(name);
      var c = new Class(name, $container);
      c.load(param, function () {
        if (++complete === len) cb();
      });
    });
  }

  function getTemplate(name) {
    if (name in knownTemplates) {
      return knownTemplates[name];
    } else {
      var template = Config.require.component(name);
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
      var _Class = Config.require.template('html!' + name);
      if (_Class) {
        knownComponents[name] = _Class;
        return _Class;
      }
    }
    console.error("Component not found: " + name);
    return Component;
  }

  function define(name, props, base) {
    var c = (base || Component).extend(props || {});
    knownComponents[name] = c;
    return c;
  }

  var _RE = /^#([0-9a-zA-Z_\-\/\.]+)/;
  var getComponentName = function getComponentName(hash) {
    var match = _RE.exec(hash);
    return match && match[1] || "";
  };

  var Router = Component.extend({
    template: '{{#name}}<div f-component="{{name}}" />{{/name}}' + '{{^name}}`DefaultComponent` is not defined{{/name}}',
    current: getComponentName(location.hash),
    init: function init(name, $container) {
      var _this = this;

      this._super(name, $container);
      this.subscribe("onpopstate", function (topic, hash) {
        var component = getComponentName(hash);
        if (_this.current != component) {
          _this.current = component;
          _this.load();
        }
      });
    },
    data: function data(cb, param) {
      cb({
        name: this.current || this.DefaultComponent
      });
    }
  });

  window.onpopstate = function () {
    Config.Pubsub.publish("onpopstate", location.hash);
  };

  var index = {
    component: define,
    Router: Router,
    init: function init(options) {
      for (var k in Config) {
        if (options[k]) Config[k] = options[k];
      }
    },
    build: function build$$($root, cb) {
      build($root, {}, function () {
        if (cb) cb();
      });
    }
  };

  return index;

}());
//# sourceMappingURL=fractal.iife.js.map