const getItems = (() => {
  let cnt = 0;
  return function(n) {
    const items = [];
    while (n--) items.push(cnt++);
    return items;
  }
})();

F.component('load_more', {
  data: {
    items: getItems(30),
  },
  loadMore: function(cb){
    setTimeout(() => cb(getItems(10)), 600);
  },
  rendered: function(cb) {
    this.el.onInfiniteScroll = (cb) => {
      this.loadMore((items) => {
        this.ractive.push.apply(this.ractive, ['items'].concat(items));
        cb();
      });
    };
  }
}, 'Base');
