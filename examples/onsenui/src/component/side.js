F.component('side', {
  rendered: function(cb) {
    this.el.querySelectorAll('*[data-link]').forEach(n => {
      n.onclick = () => {
        this.publish('tab.nav', n.getAttribute('data-link'));
        this.el.close();
      }
    });
    cb();
  }
}, 'Base');
