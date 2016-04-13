require('marked')

module.exports = F.component("markdown", {
  template: template,
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
