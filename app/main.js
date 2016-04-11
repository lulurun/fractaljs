import F from '../src/index'

export const main = F.component('main', {
  DefaultComponent: 'list',
}, F.Router);

import template from './list.html'

let examples = [
  "markdown",
  "button",
];

export const list = F.component('list', {
  template: template,
  data: examples.map(v => {
    return { href: "#" + v, name: v }
  }),
});

