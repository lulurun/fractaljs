import Pubsub from './pubsub'

export default {
  compile: function(text) { return text; },
  render: function(template, data) {},
  Pubsub: Pubsub,
  require: {
    // component: require.context('./component', false, /^\.\/.*\.js$/),
    // template: require.context('./template', false, /^\.\/.*\.html$/),
  },
}
