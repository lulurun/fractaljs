F.component('home', {
  rendered: function(cb) {
    this.el.querySelectorAll('*[data-link]').forEach(n => {
      n.onclick = () => {
        this.publish('app.nav', n.getAttribute('data-link'));
      }
    });
    cb();
  }
}, 'Base');
