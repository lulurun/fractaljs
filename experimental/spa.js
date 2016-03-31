(function(global){
  F.History = (typeof(global.History) === "object") ? global.History : global.history;
  if (!F.History) {
    console.error("history support is not found, I am not fully working");
  }

  var _dec = function(s){ return decodeURIComponent(s.replace(/\+/g, " ")); };

  var spa = F.spa = {};
  var decodeParam = spa.decodeParam = function(queryString){
    if (!queryString) return {};
    var a = queryString.split("?");
    var component = a[0];
    var params = {};
    if (a[1]) {
      var parts = a[1].split("&");
      parts.forEach(function(v){
        var kv = v.split("=");
        params[_dec(kv[0])] = kv[1] ? _dec(kv[1]) : null;
      });
    }
    return {
      component: component,
      params: params,
    };
  };

  var encodeParam = spa.encodeParam = function(component, params) {
    queryString = component || "";
    var kvp = [];
    for (var k in params) kvp.push([k, params[k] || ""]);
    var paramString = kvp.map(function(v){
      return encodeURIComponent(v[0]) + "=" + encodeURIComponent(v[1]);
    }).join("&");
    if (paramString) queryString += "?" + paramString;
    return queryString;
  };

  spa.Router = F.component({
    template: '{{#name}}<div f-component="{{name}}" />{{/name}}',
    init: function(name, $container) {
      var self = this;
      self._super(name, $container);
      if (!self.DefaultComponent) {
        throw new Error(self.name + ": DefaultComponent is not defined in subclass");
      }
      self.subscribe("spa.component.changed", function(topic, component){
        component = component || self.DefaultComponent;
        if (self._current !== component) {
          self._current = component;
          self.load();
        }
      });
      self._current = spa.component || self.DefaultComponent;
    },
    getData: function(cb) {
      cb({name: this._current});
    },
  });

  spa.navigate = function(component, params) {
    var url = "/#" + encodeParam(component, params);
    if (url !== location.href) { // TODO
      parseUrl(url);
      F.History.pushState("", "", url);
    }
  };

  var query = spa.query = {};
  spa.component = "";

  var parseUrl = function(url) {
    var parts = url.split("#");
    var queryString = parts[1];
    var decoded = decodeParam(queryString);
    var params = decoded.params || {};
    var isChanged = false;
    var changed = {};
    for (var k in params) {
      v = params[k];
      if (query[k] !== v) {
        changed[k] = [query[k], v];
        isChanged = true;
      }
      query[k] = v;
    }
    var removeList = [];
    for (var k in query) {
      if (!(k in params)) {
        changed[k] = [query[k], undefined];
        removeList.push(k);
        isChanged = true;
      }
    }
    removeList.forEach(function(v){ delete query[v]; });

    if (spa.component !== decoded.component) {
      spa.component = decoded.component;
      F.PubSub.publish("spa.component.changed", decoded.component);
    }

    if (isChanged) {
      F.PubSub.publish("spa.query.changed", changed);
    }
  };

  global.onpopstate = function(e, a, b){
    parseUrl(location.href);
  };

  parseUrl(location.href);
})(window);
