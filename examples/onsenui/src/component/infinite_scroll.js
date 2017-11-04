const tabs = [
  { name: 'load_more', label: 'Load More' },
  { name: 'lazy_repeat', label: 'Lazy Repeat' },
];

F.component('infinite_scroll', {
  data: {
    tabs: tabs
  },
  rendered: function(cb, param) {
    this.$tab = this.el.querySelector('ons-tabbar');
    (() => {
      let count = 0;
      this.$tab.addEventListener('init', ev => {
        if (++count === tabs.length) {
          cb();
        }
      });
    })();
  }
}, 'Base');
