(function(global){
  var COMPONENT_ATTR = "f-component";
  var idSeq = 0;
  var _noImpl = function(fn) { fn(); };
  var setImmediate = (function() {
    var timeouts = [];
    var messageName = (new Date()).getTime();

    function handleMessage(event) {
      if (event.source == window && event.data == messageName) {
        event.stopPropagation();
        if (timeouts.length > 0) {
          var fn = timeouts.shift();
          fn();
        }
      }
    }
    window.addEventListener("message", handleMessage, true);

    return function(fn) {
      timeouts.push(fn);
      window.postMessage(messageName, "*");
    };
  })();
  var forEachAsync = function(items, fn, done) {
    var count, left;
    count = left = items.length;
    if (!count) {
      done();
    } else {
      while (count) {
        fn(items[--count], function(){
          if (!--left) done();
        });
      }
    }
  };

  var Pubsub = (function(){
    var topics = {}, seq = 0;
    return {
      publish: function(topic, data, publisher) {
        var subscribers = topics[topic];
        for (var i in subscribers) subscribers[i].cb(topic, data, publisher);
      },
      subscribe: function(topic, subscriber, cb) {
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
      unsubscribe: function(topic, token) {
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
      getSubscribers: function(topic) {
        if (!(topic in topics)) return [];
        return topics[topic].map(function(v){ return v.subscriber; });
      },
    };
  })();

  var Component = (function(){
    var Class = (function(){
      /* Simple JavaScript Inheritance
       * By John Resig http://ejohn.org/
       * MIT Licensed.
       */
      // Inspired by base2 and Prototype
      var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
      var Class = function(){};
      Class.extend = function(prop) {
        var _super = this.prototype;

        initializing = true;
        var prototype = new this();
        initializing = false;

        for (var name in prop) {
          prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function(name, fn){
              return function() {
                var tmp = this._super;
                this._super = _super[name];

                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
              };
            })(name, prop[name]) :
          prop[name];
        }

        var Class = function(){
          if ( !initializing && this.init )
            this.init.apply(this, arguments);
        }

        Class.prototype = prototype;
        Class.prototype.constructor = Class;

        Class.extend = arguments.callee;
        return Class;
      };

      return Class;
    })();

    return Class.extend({
      init: function(name, $container){
        var self = this;
        self.name = name;
        self.$container = $container;
        self.id = idSeq++;
        F.all[self.id] = self;
        self.$ = self.$container.find.bind(self.$container);
        self.rendered = false;
        self.subscribeList = {};
        self.templateName = self.templateName || self.name;

        if (self.resetDisplay) self.$container.css("display", self.resetDisplay);
        self.$container.on("destroyed", self.destroyed.bind(self));

        // TODO implement if needed
        // self.children = [];
        // self.parent = null;
        if (typeof(self.template) === "string")
          self.template = F.compile(self.template);
      },
      load: function(param, cb){
        var self = this;
        console.time("Component." + self.name + self.id);
        param = param || {};

        self.rendered = false;
        self.getData(function(data, partials){
          self.getTemplate(function(template){
            self.render(data, partials, template, function() {
              self.afterRender(function(){
                self.rendered = true;
                self.loadChildren(function(){
                  self.loaded(function(){
                    console.timeEnd("Component." + self.name + self.id);
                    self.$container.removeAttr(COMPONENT_ATTR);
                    if (cb) cb();
                  }, param);
                }, param);
              }, param);
            }, param);
          }, param);
        }, param);
      },
      getData: _noImpl,
      getTemplate: function(cb, param) {
        var self = this;
        if (self.template) {
          cb(self.template);
        } else {
          require(['text!templates/' + self.templateName + ".tmpl"], function(template){
            if (!self.template) self.template = F.compile(template);
            cb(self.template);
          });
        }
      },
      render: function(data, partials, template, cb, param){
        var self = this;
        var contents = F.render(template, data, partials);
        self.$container.html(contents);
        cb();
      },
      loadChildren: function(cb, param){
        var self = this;
        var els = self.$("[" + COMPONENT_ATTR + "]");
        var len = els.length;
        if (!len) return cb();

        forEachAsync(els, function(container, cb){
          var $container = $(container);
          var componentClassName = $container.attr(COMPONENT_ATTR);
          require(['components/' + componentClassName], function(constructor){
            var component = new constructor(componentClassName, $container);
            (function(component, cb){
              setImmediate(function(){
                component.load(param, cb);
              });
            })(component, cb);
          });
        }, cb);
      },

      afterRender: _noImpl,
      loaded: _noImpl,
      destroyed: function(){
        console.debug("unload", this.name);
        this.unsubscribe();
        delete F.all[this.id];
      },

      publish: function(topic, data) { Pubsub.publish(topic, data, this); },
      subscribe: function(topic, cb){
        var self = this;
        self.subscribeList[topic] = Pubsub.subscribe(topic, self, function(topic, data, from){
          if (self.rendered) {
            cb(topic, data, from);
          } else {
            self.buffered.push(function(){
              console.debug(self.name, "recieved before render",  topic, data, from);
              cb(topic, data, from);
            });
          }
        });
      },
      unsubscribe: function() {
        var list = this.subscribeList;
        for (topic in list) Pubsub.unsubscribe(topic, list[topic]);
      },
    });
  })();

  (function(){
    global.F = {
      all: {},
      Pubsub: Pubsub,
      ComponentBase: Component,
      define: function(object, base) {
        define(function(){
          return F.component(object, base);
        });
      },
      compile: function(text) { return Hogan.compile(text) },
      render: function(template, data, options) { return template.render(data, options); },
      component: function(object, base){
        return (base || Component).extend(object || {});
      },
      build: function(param, cb){
        // call this after loading jquery
        $.event.special.destroyed = {
          remove: function(o) {
            if (o.handler) o.handler();
          }
        };

        var instance = new Component("", $(global.document));
        instance.loadChildren(function(){
          instance.rendered = true;
          if (cb) cb();
        });
      },
    };
  })();

})(window);

