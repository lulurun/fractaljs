import F from '../src/index'
import './button.css'
import template from './button.html'

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

