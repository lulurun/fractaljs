(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.F = factory());
}(this, (function () { 'use strict';

var topics = {};
var seq = 0;

var Pubsub = {
  publish: function publish(topic, data, publisher) {
    console.debug("publish", topic);
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

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var COMPONENT_ATTR = 'f-component';
var knownComponents = {};

var Component = function () {
  function Component(name, el, parent) {
    classCallCheck(this, Component);

    this.name = name;
    this.el = el;
    this.complete = false;
    this.parent = parent;
    this.children = [];
    this.subTokens = {};
  }

  createClass(Component, [{
    key: 'getData',
    value: function getData(cb, param) {
      cb(this.data || {});
    }
  }, {
    key: 'render',
    value: function render(data, cb, param) {
      var _this = this;

      this.el.innerHTML = this.template(data);
      this.el.querySelectorAll('*[f-onclick]').forEach(function (n) {
        n.onclick = function () {
          var f = new Function('this.' + n.getAttribute('f-onclick'));
          f.bind(_this)();
        };
      });
      cb();
    }
  }, {
    key: 'addChild',
    value: function addChild(name, el, cb, param) {
      console.log("add child:", name);
      var Class = knownComponents[name];
      var c = new Class(name, el, this);
      this.children.push(c);
      c.load(param, cb);
    }
  }, {
    key: 'loadChildren',
    value: function loadChildren(cb, param) {
      var _this2 = this;

      var els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
      if (!els || !els.length) {
        if (cb) cb();
        return;
      }

      var len = els.length;
      var nbComplete = 0;
      Array.prototype.forEach.call(els, function (el, i) {
        var name = el.getAttribute(COMPONENT_ATTR);
        _this2.addChild(name, el, function () {
          if (++nbComplete === len) {
            if (cb) cb();
          }
        });
      });
    }
  }, {
    key: 'destroyed',
    value: function destroyed(param) {
      this.children.forEach(function (c) {
        c.destroyed(param);
      });
      this.children = [];
      console.debug(this.name, "destroyed");
      for (var topic in this.subTokens) {
        Pubsub.unsubscribe(this.subTokens[topic]);
      }
    }
  }, {
    key: 'rendered',
    value: function rendered(cb, param) {
      if (cb) cb();
    }
  }, {
    key: 'loaded',
    value: function loaded(param) {}
  }, {
    key: 'load',
    value: function load(param, cb) {
      var _this3 = this;

      param = param || {};
      console.time('Component.' + this.name);
      this.complete = false;
      this.getData(function (data) {
        _this3.render(data, function () {
          _this3.children.forEach(function (c) {
            c.destroyed(param);
          });
          _this3.children = [];
          _this3.rendered(function () {
            _this3.loadChildren(function () {
              _this3.complete = true;
              console.timeEnd('Component.' + _this3.name);
              _this3.loaded(param);
              if (cb) cb();
            }, param);
          }, param);
        }, param);
      }, param);
    }
  }, {
    key: 'publish',
    value: function publish(topic, data) {
      Pubsub.publish(topic, data, this);
    }
  }, {
    key: 'subscribe',
    value: function subscribe(topic, cb) {
      this.subTokens[topic] = Pubsub.subscribe(topic, cb, this);
    }
  }]);
  return Component;
}();

var Root = function (_Component) {
  inherits(Root, _Component);

  function Root(el) {
    classCallCheck(this, Root);
    return possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, '', el, null));
  }

  return Root;
}(Component);

function build(el, param) {
  var root = new Root(el);
  root.loadChildren(function () {}, param);
}

function createComponent(name, def, base) {
  var baseClass = base ? knownComponents[base] : Component;
  var c = function (_baseClass) {
    inherits(c, _baseClass);

    function c(name, el, parent) {
      classCallCheck(this, c);

      var _this5 = possibleConstructorReturn(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this, name, el, parent));

      for (var k in def) {
        if (k === 'init') continue;
        if (typeof def[k] === 'function') {
          _this5[k] = def[k].bind(_this5);
        } else {
          _this5[k] = def[k];
        }
      }
      if (def.init) def.init.bind(_this5)();
      return _this5;
    }

    return c;
  }(baseClass);
  knownComponents[name] = c;
  return c;
}

window.onpopstate = function () {
  Pubsub.publish("onpopstate", location.hash);
};

var index = {
  build: build,
  component: createComponent,
  Component: Component
};

return index;

})));
//# sourceMappingURL=fractal.js.map
