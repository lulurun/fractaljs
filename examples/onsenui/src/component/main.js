F.component('main', {
  rendered: function(cb, param) {
    this.subscribe('main.splitter.toggle', () => {
      this.el.querySelector('ons-splitter').right.toggle();
    });
    cb();
  }
}, 'Base');
