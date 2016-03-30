define(["itemlist/item_store.js"], function(items){
  return F.component({
    afterRender: function(cb) {
      var self = this;
      self.$('button').click(function(){
        self.$container.remove();
      });
      cb();
    },
    getData: function(cb) {
      var self = this;
      var id = self.$container.data("id");
      cb({name: items.get(id)});
    }
  });
});
