const Ractive = require('ractive');

F.component('base', {
  init: function() {
    console.log('base init', this.name);
    this.template = require('./' + this.name + '.html');
  },
  render: function(data, template, cb, param) {
    console.log('render', this.name);
    this.ractive = Ractive.default({
      target: this.el,
      data: data,
      template: template,
      oncomplete: () => {
        console.log('ractive oncomplete', this.name);
        cb();
      }
    });
  },
  update: function(data) {
    for (const i in data) {
      this.ractive.set(i, data[i]);
    }
  }
});
