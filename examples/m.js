F.component("m", {
  DefaultPage: {
    name: "mp_center",
    param: {text: "default load"},
  },
}, F.m.Navigator);

var cnt = 0;
["center", "left", "right", "top", "bottom"].forEach(function(v){
  F.component("mp_" + v, {
    template: '<div class="container"><h1>{{name}}</h1>' +
      '<div f-component="mp_btns" />' +
      '<p><div class="well well-lg">{{#cnt}}{{cnt}}{{/cnt}} {{#text}}{{text}}{{/text}}</div></p>' +
      '<p>{{platform}}</p>' +
      '</div>',
    getData: function(cb, shared){
      console.log("[" + this.name + "] getData", shared, cnt);
      cb({
        name: this.name,
        text: shared.text,
        cnt: ++cnt,
        platform: F.spa.platform,
      });
    },
  });
});

F.component("mp_btns", {
  template: '' +
    '<button class="btn btn-default btn-push" data-trans="SCALE_DOWN_FROM_TOP">push top</button> ' +
    '<button class="btn btn-default btn-push" data-trans="MOVE_TO_TOP_SCALE_UP">push bottom</button> ' +
    '<button class="btn btn-default btn-push" data-trans="MOVE_TO_LEFT_FROM_RIGHT">push left</button> ' +
    '<button class="btn btn-default btn-push" data-trans="MOVE_TO_RIGHT_FROM_LEFT">push right</button>' +
    '<br/><br/>' +
    '<button class="btn btn-primary" id="btn-pop">pop</button>',
  afterRender: function(cb, param){
    var self = this;
    self.$(".btn-push").click(function(){
      var page = $(this).text().split(" ")[1];
      F.m.navigator("m").push("mp_" + page, {text: "pushed " + page}, F.m.TRANS[$(this).data("trans")]);
    });
    self.$("#btn-pop").click(function(){
      F.m.navigator("m").pop(false);
    });
    cb();
  }
});
