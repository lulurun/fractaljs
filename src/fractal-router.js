(function(global){
  var _re = /^#([0-9a-zA-Z_\-\/\.]+)/;

  F.Router = F.BaseComponent.extend({
    template: '{{#name}}<div f-component="{{name}}" />{{/name}}' +
      '{{^name}}`DefaultComponent` is not defined{{/name}}',
    init: function(name, $container) {
      var self = this;
      self._super(name, $container);
      self.subscribe("onpopstate", function(topic, hash){
        var component = getComponentName(hash);
        if (_current != component) {
          _current = component;
          self.load();
        }
      });
    },
    data: function(cb, param) {
      cb({name: _current || this.DefaultComponent});
    },
  });

  var getComponentName = function(hash) {
    var match = _re.exec(hash);
    return (match && match[1]) || "";
  };

  global.onpopstate = function(){
    F.PubSub.publish("onpopstate", location.hash);
  };

  var _current = getComponentName(location.hash);
})(window);
