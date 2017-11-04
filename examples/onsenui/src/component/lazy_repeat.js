// NOTE this is not a good use case for fractaljs
// should be done in other ways
F.component('lazy_repeat', {
  rendered: function(cb){
    var infiniteList = this.el.querySelector('ons-lazy-repeat');

    infiniteList.delegate = {
      createItemContent: function (i) {
        return ons.createElement(`<ons-list-item>Item #${i}</ons-list-item>`);
      },
      countItems: function () {
        return 3000;
      }
    };

    infiniteList.refresh();
  }
}, 'Base');
