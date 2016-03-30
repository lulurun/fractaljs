define(function(){
  var examples = [
    "markdown",
    "itemlist",
  ];

  return F.component({
    getData: function(cb) {
      var data = examples.map(function(v){
        return { href: "#" + v + "/" + v, name: v }
      });
      cb({ examples: data });
    }
  });
});
