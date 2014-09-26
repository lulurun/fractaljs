F("main", F.Component.extend({
  Public: {
    'showActivities': function(){
      this.load({componentName: 'github_activities2'});
    },
    'showProfile': function(userName){
      this.load({componentName: 'github_profile', user: userName});
    },
  },
  getData: function(cb, data) {
    var componentName = (data && data.componentName) || "github_activities2";
    this.data = { componentName: componentName };
    cb();
  }
}));
