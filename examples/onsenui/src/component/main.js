F.component('main', {
  rendered: function(cb, param) {
    this.subscribe('appSplitter.toggle', () => {
      this.el.querySelector('#appSplitter').right.toggle();
    });
    cb();
  }
}, 'Base');
