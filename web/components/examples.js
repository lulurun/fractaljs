F(function(){
  var examples = [
    {
      type: "app",
      name: "todomvc",
      url: "examples/todomvc/index.html",
    },
    {
      type: "app",
      name: "myself",
      url: "index.html"
    }
  ];
  var exampleByName = {};
  examples.forEach(function(v){ exampleByName[v.name] = v });

  F("examples", F.Component.extend({}));

  F("example_sidebar", F.Component.extend({
    getData: function(cb) {
      this.data = { examples: examples };
      cb();
    }
  }));

  F("example_body", F.Component.extend({
    onHashChanged: function(data){
      if (data.name) this.load();
    },
    getData: function(cb) {
      var exampleName = F.query.name || examples[0].name;
      this.data = exampleByName[exampleName];
      cb();
    }
  }));
});
