import {Component, build, registerComponent} from './component'
import Pubsub from './pubsub'

function createComponent(name, def) {
  registerComponent(name, class extends Component {
    constructor(name, el, parent) {
      super(name, el, parent);
      for (const k in def) {
        if (typeof def[k] === 'function') {
          this[k] = def[k].bind(this);
        } else {
          this[k] = def[k];
        }
      }
      if (this.init) this.init();
    }
  });
}

window.onpopstate = function () {
  Pubsub.publish("onpopstate", location.hash);
};

export default {
  build: build,
  component: createComponent,
}
