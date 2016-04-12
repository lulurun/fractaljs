import 'marked'
import F from '../../dist/fractal.es6'
import template from '../template/markdown.html'

export default F.component("markdown", {
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
