var marked = require('marked')

export default F.component("markdown", {
  rendered: function() {
    var doc = marked(this.mdData);
    this.$("#marked").html(doc);
  },
  getData: function(cb) {
    var md = "../README.md";
    $.get(md, data => {
      this.mdData = data;
      cb({raw: data});
    });
  }
});
