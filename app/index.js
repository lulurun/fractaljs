// let $ = 'jquery'
// let Mustache from 'mustache'

export * from './button'
export * from './markdown'
export * from './main'

import F from '../src/index'

F.init({
  render: Mustache.render,
});
F.build($(document));
