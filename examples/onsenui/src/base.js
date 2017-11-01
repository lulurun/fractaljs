const Ractive = require('ractive');

F.component('Base', {
  render: function(data, cb, param) {
    let ractiveRender = (el) => {
      return Ractive.default({
        target: el,
        data: data,
        template: this.template,
        oncomplete: () => {
          this.el.querySelectorAll('*[f-onclick]').forEach(n => {
            n.onclick = () => {
              let f = new Function('this.' + n.getAttribute('f-onclick'));
              f.bind(this)();
            }
          });
          cb();
        },
      });
    }

    if (!this.template)
      this.template = require('./component/' + this.name + '.html');
    if (this.el.tagName === 'ONS-PAGE') {
      const el = this.el.querySelector('.page__content');
      if (!el) {
        this.el.addEventListener('init', ev => {
          if (ev.target === this.el) {
            console.log('ons-page init', this.name);
            this.ractive = ractiveRender(this.el.querySelector('.page__content'));
          }
        });
      } else {
        this.ractive = ractiveRender(el);
      }
    } else {
      this.ractive = ractiveRender(this.el);
    }
  },
  update: function(data) {
    for (let i in data) {
      this.ractive.set(i, data[i]);
    }
  }
});
