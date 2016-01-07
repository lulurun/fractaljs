(function(){
  var MAX_TRANS_TYPE = 1000;
  var TRANS = {
    NO_ANIMATION: MAX_TRANS_TYPE,
    MOVE_TO_LEFT_FROM_RIGHT: 1,
    SCALE_DOWN_FROM_TOP: 2,

    SCALE_DOWN_SCALE_UP: 500,

    MOVE_TO_TOP_SCALE_UP: MAX_TRANS_TYPE - 2,
    MOVE_TO_RIGHT_FROM_LEFT: MAX_TRANS_TYPE - 1,
  };
  var TRANS_CLASSES = (function(){
    var d = {};
    d[TRANS.MOVE_TO_LEFT_FROM_RIGHT] = [
      "pt-page-moveToLeft",
      "pt-page-moveFromRight"
    ];
    d[TRANS.SCALE_DOWN_FROM_TOP] = [
      "pt-page-scaleDown",
      "pt-page-moveFromTop pt-page-ontop",
    ];
    d[TRANS.SCALE_DOWN_SCALE_UP] = [
      'pt-page-scaleDownCenter',
      'pt-page-scaleUpCenter pt-page-delay400'
    ];
    d[TRANS.MOVE_TO_RIGHT_FROM_LEFT] = [
      'pt-page-moveToRight',
      'pt-page-moveFromLeft',
    ];
    d[TRANS.MOVE_TO_TOP_SCALE_UP] = [
      'pt-page-moveToTop pt-page-ontop',
      'pt-page-scaleUp',
    ];
    return d;
  })();
  var TRANS_END_EVENT = "webkitAnimationEnd";

  var m = F.m = {};
  var registerNavigator = (function(){
    var navigators = {};
    m.navigator = function(name) { return navigators[name]; };
    return function(component) {
      navigators[component.name] = component;
    };
  })();
  m.TRANS = TRANS;
  m.Page = F.ComponentBase.extend({
    template: '{{#name}}<div f-component="{{name}}" />{{/name}}',
    init: function(componentName, $container, f) {
      var self = this;
      self._super("m-page", $container, f);
      self.componentName = componentName;
    },
    getData: function(cb) {
      cb({name: this.componentName});
    },
  });
  m.Navigator = F.ComponentBase.extend({
    template: '<div class="f-perspective" id="f-navigator-{{name}}" />',
    init: function(name, $container, f) {
      var self = this;
      self._super(name, $container, f);
      registerNavigator(self);
      self.flag = false;
      self.history = [];
    },
    lock: function() {
      var self = this;
      if (self.flag) return false;
      self.flag = true;
      self.__unlocker = setTimeout(function(){
        console.debug("unlocked by timeout");
        self.flag = false;
        self.__unlocker = null;
      }, 1000);
      return true;
    },
    unlock: function() {
      this.flag = false;
      if (this.__unlocker) {
        clearTimeout(this.__unlocker);
        this.__unlocker = null;
      }
    },
    push: function(componentName, param, transType, cb) {
      var self = this;
      if (!self.lock()) {
        if (cb) cb();
        return;
      }
      var current = self.history.length;
      var next = current + 1;
      var nbPages = self.$(".f-page").length;
      if (next == nbPages) {
        self.addPage();
      }

      var $pages = self.$(".f-page");
      var $currPage = $pages.eq(current);
      var $nextPage = $pages.eq(next);

      var c = new m.Page(componentName, $nextPage, self.f);
      c.load(param);

      var state = {
        component: c,
        param: param,
        trans: transType,
      };
      self.history.push(state)
      trans($currPage, $nextPage, transType, function(){
        self.unlock();
        if (cb) cb();
      });
    },
    pop: function(reload, cb) {
      var self = this;
      if (!self.lock()) {
        if (cb) cb();
        return;
      }
      if (self.history.length === 0) {
        self.unlock();
        if (cb) cb();
        return;
      }
      var current = self.history.length;
      var next = current - 1;
      if (reload) {
        var s = next ? self.history[next-1] : self.defaultState;
        s.component.load(s.param);
      }
      var state = self.history.pop();
      var transType = MAX_TRANS_TYPE - state.trans;
      var $pages = self.$(".f-page");
      var $currPage = $pages.eq(current);
      var $nextPage = $pages.eq(next);

      trans($currPage, $nextPage, transType, function(){
        if (cb) cb();
        self.unlock();
      });
    },
    addPage: function(){
      var self = this;
      var $page = $('<div class="f-page f-page-current">');
      self.$('#f-navigator-' + self.name).append($page);
      return $page;
    },
    allLoaded: function(callback) {
      var self = this;
      var $p = self.addPage();
      var c = new m.Page(self.DefaultPage.name, $p, self.f);
      c.load(self.DefaultPage.param);
      self.defaultState = {
        component: c,
        param: self.DefaultPage.param,
      };
      callback();
    },
    getData: function(callback) {
      var self = this;
      callback({
        name: self.name,
      });
    }
  });

  var trans = function($currPage, $nextPage, transType, cb) {
    transType = transType || TRANS.NO_ANIMATION;
    if (transType == TRANS.NO_ANIMATION) {
      return cb();
    }
    $nextPage.addClass('f-page-current');
    var classes = TRANS_CLASSES[transType];
    (function(classes){
      var complete = 0;
      $currPage.addClass(classes[0]).on(TRANS_END_EVENT, function(){
        $currPage.off(TRANS_END_EVENT);
        $currPage.removeClass(classes[0]);
        $currPage.removeClass('f-page-current');
        if(++complete === 2) {
          cb();
        }
      });
      $nextPage.addClass(classes[1]).on(TRANS_END_EVENT, function(){
        $nextPage.off(TRANS_END_EVENT);
        $nextPage.removeClass(classes[1]);
        if(++complete === 2) {
          cb();
        }
      });
    })(classes);
  };

})();
