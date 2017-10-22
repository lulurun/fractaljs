const Ractive = require('ractive');

function ractiveRender(el, data, template, cb) {
  return Ractive.default({
    target: el,
    data: data,
    template: template,
    oncomplete: cb,
  });
}

F.component('Base', {
  render: function(data, cb, param) {
    if (!this.template)
      this.template = require('./component/' + this.name + '.html');
    if (this.el.tagName === 'ONS-PAGE') {
      let el = this.el.querySelector('.page__content');
      if (!el) {
        this.el.addEventListener('init', ev => {
          if (ev.target === this.el) {
            console.log('ons-page init', this.name);
            this.ractive = ractiveRender(this.el.querySelector('.page__content'), data, this.template, cb);
          }
        });
      } else {
        this.ractive = ractiveRender(el, data, this.template, cb);
      }
    } else {
      this.ractive = ractiveRender(this.el, data, this.template, cb);
    }
  },
  update: function(data) {
    for (const i in data) {
      this.ractive.set(i, data[i]);
    }
  }
});
