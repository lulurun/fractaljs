let template = require('../template/list.html');

let examples = [
  "markdown",
  "button",
];

module.exports = F.component('list', {
  template: template,
  data: examples.map(v => {
    return { href: "#" + v, name: v }
  }),
});

