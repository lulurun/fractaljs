F(function(){
  var KEY = "fractaljs-demo-loginName";

  F("login", F.Component.extend({
    onLoginChanged: function(data){
      var name = localStorage.getItem(KEY);
      this.load(name);
    },
    getData: function(cb, param) {
      var name = param;
      if (name) {
        this.data = { componentName: "hello2" };
      } else {
        this.data = { componentName: "form" };
      }
      cb();
    }
  }));

  F("form", F.Component.extend({
    afterRender: function(cb){
      var self = this;
      self.$("#btn-login").click(function(){
        var name = self.$("#input-name").val().trim();
        if (!name) return false;
        localStorage.setItem(KEY, name);
        self.publish('LoginChanged');
        return false;
      });
      cb();
    }
  }));

  F("hello2", F.Component.extend({
    afterRender: function(cb){
      var self = this;
      self.$("#btn-logout").click(function(){
        localStorage.removeItem(KEY);
        self.publish('LoginChanged');
      });
      cb();
    }
  }));
});
