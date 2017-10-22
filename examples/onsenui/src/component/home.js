F.component('home', {
  rendered: function(cb) {
    this.el.querySelectorAll('*[data-link]').forEach(n => {
      n.onclick = () => {
        location.hash = n.getAttribute('data-link');
      }
    });
    cb();
  }
}, 'Base');
