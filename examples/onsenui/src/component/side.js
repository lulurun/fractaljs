F.component('side', {
  rendered: function(cb) {
    this.el.querySelectorAll('*[data-link]').forEach(n => {
      n.onclick = () => {
        location.hash = n.getAttribute('data-link');
        this.el.close();
      }
    });
    cb();
  }
}, 'Base');
