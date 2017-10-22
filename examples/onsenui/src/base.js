const Ractive = require('ractive');

function ractiveRender(el, data, template, cb) {
  return Ractive.default({
    target: el,
    data: data,
    template: template,
    oncomplete: () => {
      console.log('Ractive oncomplete', el);
      cb();
    }
  });
}

F.component('Base', {
  init: function() {
    console.log('base init', this.name);
    this.template = require('./component/' + this.name + '.html');
  },
  render: function(data, template, cb, param) {
    if (this.el.tagName === 'ONS-PAGE') {
      let el = this.el.querySelector('.page__content');
      if (!el) {
        this.el.addEventListener('init', ev => {
          if (ev.target === this.el) {
            console.log('ons-page inti', this.name);
            this.ractive = ractiveRender(this.el.querySelector('.page__content'), data, template, cb);
          }
        });
      } else {
        this.ractive = ractiveRender(el, data, template, cb);
      }
    } else {
      this.ractive = ractiveRender(this.el, data, template, cb);
    }
  },
  update: function(data) {
    for (const i in data) {
      this.ractive.set(i, data[i]);
    }
  }
});
