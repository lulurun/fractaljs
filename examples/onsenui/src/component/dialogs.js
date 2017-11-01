F.component('dialogs', {
  openDialog: function(name) {
    const el = this.el.querySelector('#' + name + '-dialog');
    el.show();
    if (name === 'modal') {
      setTimeout(() => {
        this.hideDialog(name);
      }, 2000);
    }
  },
  hideDialog: function(name) {
    const el = this.el.querySelector('#' + name + '-dialog');
    el.hide();
  },
  rendered: function(cb, param){
    this.el.querySelectorAll('*[f-onclick]').forEach(n => {
      n.onclick = () => {
        (() => {
          eval('this.' + n.getAttribute('f-onclick'));
        }).call(this);
      }
    });
  }
}, 'Base');
