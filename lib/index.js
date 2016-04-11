import { define, build as _build } from './component';
import config from './config';

export default {
  component: define,
  init: function init(options) {
    for (var k in config) {
      if (options[k]) config[k] = options[k];
    }
  },
  build: function build($root, cb) {
    _build($root, {}, function () {
      if (cb) cb();
    });
  }
};