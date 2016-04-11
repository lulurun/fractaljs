(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('jquery'), require('mustache')) :
  typeof define === 'function' && define.amd ? define(['jquery', 'mustache'], factory) :
  (factory(global.$,global.Mustache));
}(this, function ($,Mustache) { 'use strict';

  $ = 'default' in $ ? $['default'] : $;
  Mustache = 'default' in Mustache ? Mustache['default'] : Mustache;

  function __$styleInject(css) {
    css = css || '';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
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

  babelHelpers.get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  babelHelpers.inherits = function (subClass, superClass) {
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

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers;

  var Component = function () {
    function Component(name, $container) {
      babelHelpers.classCallCheck(this, Component);

      this.name = name;
      this.$container = $container;
      this.rendered = false;
      this.subTokens = {};

      console.log("A>>>>>>", this.$container);
      this.$ = this.$container.find.bind(this.$container);
      //this.$container.on("destroyed", this.destroyed.bind(this));
    }

    babelHelpers.createClass(Component, [{
      key: "getData",
      value: function getData(cb, param) {
        cb();
      }
    }, {
      key: "render",
      value: function render(data, template, cb, param) {
        this.$container.html(Mustache.render(template, data));
        cb();
      }
    }, {
      key: "loadChildren",
      value: function loadChildren(cb, param) {
        ;
      }
    }, {
      key: "load",
      value: function load(param, cb) {
        var _this = this;

        console.log("Component." + this.name);
        this.rendered = false;
        this.getData(function (data) {
          return _this.render(data, _this.template, function (a) {
            return _this.afterRender(cb);
          });
        });
      }
    }]);
    return Component;
  }();

  __$styleInject(".button {\n  background: tomato;\n  color: white;\n}\n");

  var template = "<a class=\"button\" href=\"{{link}}\">{{text}}</a>\n\n";

  var Button = function (_Component) {
    babelHelpers.inherits(Button, _Component);

    function Button($container, link) {
      babelHelpers.classCallCheck(this, Button);

      console.log($container, link);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Button).call(this, "button", $container));

      _this.link = link;
      _this.template = template;
      return _this;
    }

    babelHelpers.createClass(Button, [{
      key: 'onClick',
      value: function onClick(event) {
        event.preventDefault();
        alert(this.link);
      }
    }, {
      key: 'getData',
      value: function getData(cb, param) {
        var _this2 = this;

        babelHelpers.get(Object.getPrototypeOf(Button.prototype), 'getData', this).call(this, function (_) {
          cb({
            link: _this2.link,
            text: "aaa"
          });
        });
      }
    }, {
      key: 'afterRender',
      value: function afterRender(node) {
        this.$('.button').click(this.onClick.bind(this));
      }
    }]);
    return Button;
  }(Component);

  var button = new Button($('a'), 'google.com');
  button.load({}, function () {
    console.log("done");
  });

}));
//# sourceMappingURL=app.js.map