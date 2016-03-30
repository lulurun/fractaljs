define(["itemlist/item_store.js"], function(items){
  return F.component({
    init: function(name, $container){
      var self = this;
      self._super(name, $container);
      self.subscribe('item.added', function(topic, item){
        self.load({
          append: true,
          item: item,
        })
      });
    },
    render: function(data, partials, template, cb, param){
      var self = this;
      if (param.append) {
        var contents = F.render(template, data, partials);
        self.$container.append(contents);
        cb();
      } else {
        self._super(data, partials, template, cb, param);
      }
    },
    getData: function(cb, param) {
      if (!param.append) {
        cb({items: items.all()});
      } else {
        cb({items: [param.item]});
      }
    }
  });
});

