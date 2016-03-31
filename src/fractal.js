(function(global){
  var COMPONENT_ATTR = "f-component";
  var idSeq = 0;
  var _noImpl = function(fn) { fn(); };
  var Component = (function(){
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
  })().extend({
    init: function(name, $container){
      var self = this;
      self.name = name;
      self.$container = $container;
      self.id = idSeq++;
      F.all[self.id] = self;
      self.$ = self.$container.find.bind(self.$container);
      self.rendered = false;
      self.subTokens = {};
      self.templateName = self.templateName || self.name;

      if (self.display) self.$container.css("display", self.display);
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

      var complete = 0;
      for (var i=0; i<len; i++) {
        (function($container){
          var name = $container.attr(COMPONENT_ATTR);
          require(['components/' + name], function(component){
            var instance = new component(name, $container);
            instance.load(param, function(){
              if (++complete == len) cb()
            });
          });
        })($(els[i]));
      }
    },
    afterRender: _noImpl,
    loaded: _noImpl,
    destroyed: function(){
      console.debug("unload", this.name);
      this.unsubscribe();
      delete F.all[this.id];
    },

    publish: function(topic, data) { F.PubSub.publish(topic, data, this); },
    subscribe: function(topic, cb){
      this.subTokens[topic] = F.PubSub.subscribe(topic, cb);
    },
    unsubscribe: function() {
      for (var topic in this.subTokens) F.PubSub.unsubscribe(this.subTokens[topic]);
    },
  });

  global.F = {
    $: $,
    TE: Hogan,
    PubSub: PubSub,
    all: {},
    define: function(object, base) { // syntactic sugar for defining a component
      define(function(){
        return F.component(object, base);
      });
    },
    component: function(object, base){
      return (base || Component).extend(object || {});
    },
    compile: function(text) { return F.TE.compile(text) },
    render: function(template, data, options) { return template.render(data, options); },
    build: function(cfg, cb){
      cfg = cfg || {};
      for (var i in F) cfg[i] && (F[i] = cfg[i]);
      F.$.event.special.destroyed = {
        remove: function(o) {
          if (o.handler) o.handler();
        }
      };

      var instance = new Component("", F.$(global.document));
      instance.loadChildren(function(){
        instance.rendered = true;
        if (cb) cb();
      });
    },
  };
})(window);
