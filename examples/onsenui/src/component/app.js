F.component('app', {
  init: function() {
    this.subscribe('onpopstate', (topic, hash) => {
      // const parts = hash.split('/');
      // if (parts.length >= 2) {
      //   let name = parts[1];
      //   console.log('pushPage', name);
      //   this.el.pushPage(name);
      // }
    });
  },
  rendered: function(cb, param) {
    // this.subscribe('appSplitter.toggle', () => {
    //   this.el.querySelector('#appSplitter').right.toggle();
    // });
    cb();
  }
}, 'Base');
