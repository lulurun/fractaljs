import {define, build} from './component'
import Config from './config'
import Router from './router'

export default {
  component: define,
  Router: Router,
  init: function(options) {
    for (let k in Config) {
      if (options[k]) Config[k] = options[k];
    }
  },
  build: function($root, cb) {
    build($root, {}, function(){
      if (cb) cb();
    });
  },
  Pubsub: Config.Pubsub,
}

