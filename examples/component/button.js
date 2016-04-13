require('../template/button.css')
const link = "google.com";

export default F.component("button", {
  template: require('../template/button.html'),
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

