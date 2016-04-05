define(function(){
  var examples = [
    "markdown",
    "itemlist",
  ];

  return F.component("examples", {
    getData: function(cb) {
      var data = examples.map(function(v){
        return { href: "#" + v + "/main", name: v }
      });
      cb({ examples: data });
    }
  });
});
