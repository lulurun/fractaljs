F('angularjs', F.Component.extend({
  afterRender: function(cb){
    var js = 'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.17/angular.min.js';
    this.require(js, function(){
      cb();
    });
  }
}));
