F('main', F.Component.extend({}));

F('font', F.Component.extend({
  template: '<span style="font-family:{{name}}">{{envName}}:{{name}}</span>',
  getData: function(cb, param){
    cb({
      envName: this.F.getName(),
      name: this.name
    });
  }
}));

F('Georgia', function(env, cb){
  env.getComponentClass('font', function(base){
    cb(base.extend({}));
  });
});

F('Arial', function(env, cb){
  env.getComponentClass('font', function(base){
    cb(base.extend({}));
  });
});
