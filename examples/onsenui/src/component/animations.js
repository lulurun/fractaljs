F.component('animations', {
  rendered: function(cb, param) {
    this.el.querySelectorAll('*[data-push]').forEach(n => {
      n.onclick = () => {
        this.publish('app.nav', {
          hash: n.getAttribute('data-push'),
          trans: n.getAttribute('data-trans'),
        });
      }
    });
    cb();
  }
}, 'Base');
