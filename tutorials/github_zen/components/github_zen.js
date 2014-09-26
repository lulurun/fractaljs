F("github_zen", F.Component.extend({
  afterRender: function(cb) {
    var self = this;
    self.$('.btn').click(function(){
      self.load();
    });
    cb();
  },
  getData: function(cb) {
    var self = this;
    var url = "https://api.github.com/zen";
    var option = {contentType: "application/vnd.github.VERSION.text+json"};
    self.require(url, option, function(data){
      self.data = { zen: data };
      cb();
    });
  }
}));
