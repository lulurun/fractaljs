import Pubsub from './pubsub'

const COMPONENT_ATTR = 'f-component'
const knownComponents = {}

export class Component {
  constructor(name, el, parent) {
    this.name = name;
    this.el = el;
    this.complete = false;
    this.parent = parent;
    this.children = [];
    this.subTokens = {};
  }

  getData(cb, param) {
    cb(this.data || {});
  }

  render(data, template, cb, param) {
    this.el.innerHTML = template(data);
    cb();
  }

  loadChildren(cb, param) {
    const els = this.el.querySelectorAll('[' + COMPONENT_ATTR + ']');
    if (!els || !els.length) {
      if (cb) cb();
      return;
    }

    const len = els.length;
    let nbComplete = 0;
    Array.prototype.forEach.call(els, (el, i) => {
      const name = el.getAttribute(COMPONENT_ATTR);
      console.log("load component:", name);
      const Class = knownComponents[name];
      const c = new Class(name, el, this);
      this.children.push(c);
      c.load(param, () => {
        if (++nbComplete === len) {
          if (cb) cb();
        }
      });
    });
  }

  destroyed(param) {
    this.children.forEach(c => {
      c.destroyed(param);
    });
    this.children = [];
    console.debug(this.name, "destroyed");
    for (let topic in this.subTokens)
      Pubsub.unsubscribe(this.subTokens[topic]);
  }

  rendered(cb, param) {
    if (cb) cb();
  }
  loaded(param){}

  load(param, cb) {
    param = param || {};
    console.time('Component.' + this.name);
    this.complete = false;
    this.getData(data => {
      console.log(this.name, data);
      this.render(data, this.template, () => {
        this.children.forEach(c => {
          c.destroyed(param);
        });
        this.children = [];
        this.rendered(() => {
          this.loadChildren(() => {
            this.complete = true;
            console.timeEnd('Component.' + this.name);
            this.loaded(param);
            if (cb) cb();
          }, param)
        }, param);
      }, param);
    }, param)
  }

  publish(topic, data) {
    Pubsub.publish(topic, data, this);
  }

  subscribe(topic, cb) {
    this.subTokens[topic] = Pubsub.subscribe(topic, cb, this);
  }
}

class Root extends Component {
  constructor(el) {
    super('', el, null);
  }
}

export function build(el, param) {
  const root = new Root(el);
  root.loadChildren(() => {}, param);
}

export function createComponent(name, def, base) {
  const baseClass = base ? knownComponents[base] : Component;
  const c = class extends baseClass {
    constructor(name, el, parent) {
      super(name, el, parent);
      for (const k in def) {
        if (k === 'init') continue;
        if (typeof def[k] === 'function') {
          this[k] = def[k].bind(this);
        } else {
          this[k] = def[k];
        }
      }
      if (def.init) def.init.bind(this)();
    }
  };
  knownComponents[name] = c;
  return c;
}
