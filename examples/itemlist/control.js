define(["itemlist/store.js"], function(items){
  var candidates = ["d", "e", "f"];
  return F.component("itemlist/control", {
    afterRender: function(cb){
      var self = this;
      self.$('button').click(function(){
        var v = candidates.pop();
        id = items.add(v);
        self.publish("item.added", {id: id, value: v});
        if (!candidates.length) self.$('button').prop('disabled', true);
      });
      cb();
    }
  });
});
