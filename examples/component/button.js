require('../template/button.css')
require('../template/button.html')

let link = "google.com";

module.exports = F.component("button", {
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

