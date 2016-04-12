import F from '../../dist/fractal.es6'
import '../template/button.css'
import template from '../template/button.html'

let link = "google.com";

export default F.component("button", {
  template: template,
  init: function(name, $container) {
    this._super(name, $container);
  },
  data: {
    text: "Click me!",
  },
  rendered: function(param) {
    this.$('.button').click(e => {
      e.preventDefault();
      alert(link);
    });
  },
});

