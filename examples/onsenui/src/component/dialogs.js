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
  }
}, 'Base');
