(function(){
  var app = F.app = {};
  var PageKey = "page";

  var decodeParam = app.decodeParam = function(queryString){
    if (!queryString) return {};
    var match,
    pl     = /\+/g,  // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
    myQuery = {};

    while (m = search.exec(queryString)) {
      if (!m[2] && !myQuery[PageKey]) {
        m[2] = m[1];
        m[1] = PageKey;
      }
      myQuery[decode(m[1])] = decode(m[2]);
    }
    return myQuery;
  };

  var encodeParam = app.encodeParam = function(data) {
    var kvp = [];
    var page = "";
    for (var i in data) {
      if (i === PageKey) {
        page = data[i];
      } else {
        kvp.push([i, data[i]])
      }
    }
    var prefix = page ? page + "&" : "";
    return prefix + kvp.map(function(v){
      return encodeURIComponent(v[0]) + "=" + encodeURIComponent(v[1]);
    }).join("&");
  };

  (function(){
    var query = app.query = {};

    var parseUrl = function(url) {
      var parts = url.split("#");
      queryString = parts[1];
      var decoded = decodeParam(queryString);
      var changed = {};
      for (var i in decoded) {
        if (query[i] !== decoded[i]) changed[i] = [query[i], decoded[i]];
        query[i] = decoded[i];
      }
      var removeList = [];
      for (var i in query) {
        if (!(i in decoded)) {
          changed[i] = [query[i], undefined];
          removeList.push(i);
        }
      }
      removeList.forEach(function(v){ delete query[v]; });
      return changed;
    };

    var triggerStateChange = function(url){
      var changed = parseUrl(url);
      for (var i in changed) {
        F.Pubsub.publish("app.query.changed", changed);
        break;
      }
    }

    app.navigate = function(url) {
      if (url !== window.location.href) {
        triggerStateChange(url);
        history.pushState("", "", url);
      }
    };

    triggerStateChange(window.location.href);

    window.onpopstate = function(e){
      // if (!e.originalEvent.state) {
      //   console.debug("pushState not called");
      //   return;
      // }
      triggerStateChange(window.location.href);
    };
  })();

  app.Router = F.ComponentBase.extend({
    template: '{{#name}}<div f-component="{{name}}" />{{/name}}',
    init: function(name, $container, f) {
      var self = this;
      self._super(name, $container, f);
      if (!self.DefaultComponent) {
        throw new Error("DefaultComponent is not defined in subclass")
      }
      self.componentName = app.query.page || self.DefaultComponent;
      self.subscribe("app.query.changed", function(topic, data){
        console.debug("received", topic, self.name, data, app.query.page);
        componentName = data.page ? (app.query.page || self.DefaultComponent) : "";
        console.debug("componentName:", componentName,
                      "self.componentName:", self.componentName);
        if (componentName && self.componentName !== componentName) {
          self.componentName = componentName;
          self.load();
        }
      });
    },
    getData: function(callback) {
      callback({name: this.componentName});
    },
    allLoaded: function(callback) {
      this.publish(this.name + ".loaded");
      callback();
    }
  });

  app.platform = (function(){
    if (window.location.href.indexOf("http") == 0) return "www";
    var isAndroid = !!(navigator.userAgent.match(/Android/i));
    var isIOS     = !!(navigator.userAgent.match(/iPhone|iPad|iPod/i));

    if (isAndroid) return "android";
    else if (isIOS) return "ios";
    else return "www";
  })();

})();

