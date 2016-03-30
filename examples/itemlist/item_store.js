define(function(){
  var items = {
    1: "a",
    2: "b",
    3: "c",
  };
  var seq = 10;

  return {
    all: function(){
      var itemList = [];
      for (var k in items) {
        itemList.push({id: k, value: items[k]});
      }
      return itemList;
    },
    get: function(id) {
      return items[id];
    },
    add: function(value) {
      items[++seq] = value;
      return seq;
    },
  };
});
