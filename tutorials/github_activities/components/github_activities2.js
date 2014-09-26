F("github_activities2", F.Component.extend({
  afterRender: function(cb) {
    var self = this;
    self.$('.showProfile').click(function(){
      self.call('main.showProfile', $(this).data('name'));
    });
  },
  getData: function(cb) {
    var self = this;
    self.require("https://api.github.com/repos/gree/fractaljs/events", function(data){
      self.data = {
        activities: data.filter(function(v){ return v.type == "CreateEvent" }),
        desc: function(){
          return "created " + this.payload.ref_type + " " + (this.payload.ref || "");
        }
      };
      cb();
    });
  }
}));
